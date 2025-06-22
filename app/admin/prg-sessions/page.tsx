"use client";

import React, { useState, useEffect, useCallback } from "react";
import Layout from "@/components/layout";

interface Presenter {
  name: string;
  link: string;
}

interface Session {
  _id?: string;
  date: string;
  paperTitle: string;
  paperLink: string;
  slidesLink?: string;
  resources?: string;
  presenter: Presenter[];
  academicYear: string;
}

interface YearSessionsData {
  [academicYear: string]: Session[];
}

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
        aria-label="Close"
        type="button"
      >
        ×
      </button>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    <p className="mt-4 text-lg text-muted-foreground">Loading sessions...</p>
  </div>
);

export default function AdminPRGSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isValidDate = useCallback(
    (date: string) => /^\d{2}-\d{2}-\d{2}$/.test(date),
    []
  );
  const isValidAcademicYear = useCallback(
    (year: string) => /^\d{4}-\d{4}$/.test(year),
    []
  );

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch("/api/prg-sessions");
      if (!response.ok) throw new Error("Failed to fetch sessions");

      const data: YearSessionsData = await response.json();
      const flatSessions: Session[] = [];

      Object.entries(data).forEach(([academicYear, yearSessions]) => {
        yearSessions.forEach((session: Session) => {
          flatSessions.push({ ...session, academicYear });
        });
      });

      setSessions(flatSessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingSession) return;

      if (!isValidDate(editingSession.date)) {
        setFormError("Date must be in DD-MM-YY format (e.g., 16-09-24)");
        return;
      }
      if (!isValidAcademicYear(editingSession.academicYear)) {
        setFormError(
          "Academic year must be in YYYY-YYYY format (e.g., 2024-2025)"
        );
        return;
      }
      if (!editingSession.presenter || editingSession.presenter.length === 0) {
        setFormError("At least one presenter is required.");
        return;
      }
      for (const p of editingSession.presenter) {
        if (!p.name.trim() || !p.link.trim()) {
          setFormError("Each presenter must have a non-empty name and link.");
          return;
        }
      }
      setFormError(null);

      try {
        const url = editingSession._id
          ? `/api/prg-sessions/${editingSession._id}`
          : "/api/prg-sessions";

        const response = await fetch(url, {
          method: editingSession._id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingSession),
        });

        if (!response.ok) throw new Error("Failed to save session");

        setEditingSession(null);
        setShowForm(false);
        fetchSessions();
      } catch (error) {
        console.error("Error saving session:", error);
        setFormError("Failed to save session. Please try again.");
      }
    },
    [editingSession, fetchSessions, isValidDate, isValidAcademicYear]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this session?")) return;

      try {
        const response = await fetch(`/api/prg-sessions/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete session");

        fetchSessions();
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    },
    [fetchSessions]
  );

  const handleAddPresenter = useCallback(() => {
    if (!editingSession) return;
    setEditingSession({
      ...editingSession,
      presenter: [...editingSession.presenter, { name: "", link: "" }],
    });
  }, [editingSession]);

  const handleRemovePresenter = useCallback(
    (index: number) => {
      if (!editingSession) return;
      setEditingSession({
        ...editingSession,
        presenter: editingSession.presenter.filter((_, i) => i !== index),
      });
    },
    [editingSession]
  );

  const handleUpdatePresenter = useCallback(
    (index: number, field: "name" | "link", value: string) => {
      if (!editingSession) return;
      const newPresenters = [...editingSession.presenter];
      newPresenters[index] = { ...newPresenters[index], [field]: value };
      setEditingSession({ ...editingSession, presenter: newPresenters });
    },
    [editingSession]
  );

  const handleCloseModal = useCallback(() => {
    setShowForm(false);
    setEditingSession(null);
    setFormError(null);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setEditingSession({
      date: "",
      paperTitle: "",
      paperLink: "",
      slidesLink: "",
      resources: "",
      presenter: [{ name: "", link: "" }],
      academicYear: "",
    });
    setIsEditing(false);
    setShowForm(true);
  }, []);

  const handleOpenEditModal = useCallback((session: Session) => {
    setEditingSession({ ...session, _id: session._id });
    setIsEditing(true);
    setShowForm(true);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  if (loading) {
    return (
      <Layout>
        <main className="max-w-6xl mx-auto px-6 py-8">
          <LoadingSpinner />
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-primary">
            PRG Sessions Admin
          </h1>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add New Session
          </button>
        </div>

        {showForm && editingSession && (
          <Modal onClose={handleCloseModal}>
            <h2 className="text-2xl font-semibold mb-4">
              {isEditing ? "Update Session" : "Add New Session"}
            </h2>
            {formError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="text"
                    value={editingSession.date}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        date: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="DD-MM-YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={editingSession.academicYear}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        academicYear: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2024-2025"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Paper Title
                </label>
                <input
                  type="text"
                  value={editingSession.paperTitle}
                  onChange={(e) =>
                    setEditingSession({
                      ...editingSession,
                      paperTitle: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Paper Link
                </label>
                <input
                  type="url"
                  value={editingSession.paperLink}
                  onChange={(e) =>
                    setEditingSession({
                      ...editingSession,
                      paperLink: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Slides Link (optional)
                </label>
                <input
                  type="url"
                  value={editingSession.slidesLink || ""}
                  onChange={(e) =>
                    setEditingSession({
                      ...editingSession,
                      slidesLink: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Resources (optional)
                </label>
                <textarea
                  value={editingSession.resources || ""}
                  onChange={(e) =>
                    setEditingSession({
                      ...editingSession,
                      resources: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Presenters
                </label>
                {editingSession.presenter.map((presenter, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={presenter.name}
                      onChange={(e) =>
                        handleUpdatePresenter(index, "name", e.target.value)
                      }
                      className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Presenter name"
                      required
                    />
                    <input
                      type="url"
                      value={presenter.link}
                      onChange={(e) =>
                        handleUpdatePresenter(index, "link", e.target.value)
                      }
                      className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Presenter link"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePresenter(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddPresenter}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Add Presenter
                </button>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {isEditing ? "Update Session" : "Create Session"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        )}

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Academic Year</th>
                <th className="px-3 py-2">Paper Title</th>
                <th className="px-3 py-2">Presenters</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr
                  key={session._id || index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-3 py-2">{session.date}</td>
                  <td className="px-3 py-2">{session.academicYear}</td>
                  <td
                    className="px-3 py-2 max-w-xs truncate"
                    title={session.paperTitle}
                  >
                    {session.paperTitle}
                  </td>
                  <td className="px-3 py-2">
                    {session.presenter.map((p) => p.name).join(", ")}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditModal(session)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => session._id && handleDelete(session._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
}
