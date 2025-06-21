"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const { data: session, status } = useSession();
  const router = useRouter();
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/admin/login");
      return;
    }
    if ((session.user as any)?.role !== "admin") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

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
          headers: {
            "Content-Type": "application/json",
          },
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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    if (session && (session.user as any)?.role === "admin") {
      fetchSessions();
    }
  }, [fetchSessions, session]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <Layout>
        <main className="max-w-6xl mx-auto px-6 py-8">
          <LoadingSpinner />
        </main>
      </Layout>
    );
  }

  // Redirect if not authenticated (this should not render due to useEffect redirect)
  if (!session || (session.user as any)?.role !== "admin") {
    return null;
  }

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
          <div>
            <h1 className="text-4xl font-bold text-primary">
              PRG Sessions Admin
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {session.user?.name || session.user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add New Session
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
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
                  Slides Link (Optional)
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
                  Resources (Optional)
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">
                    Presenters
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPresenter}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Add Presenter
                  </button>
                </div>
                {editingSession.presenter.map((presenter, index) => (
                  <div
                    key={`edit-presenter-${index}`}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2"
                  >
                    <input
                      type="text"
                      placeholder="Presenter Name"
                      value={presenter.name}
                      onChange={(e) =>
                        handleUpdatePresenter(index, "name", e.target.value)
                      }
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Presenter Link"
                        value={presenter.link}
                        onChange={(e) =>
                          handleUpdatePresenter(index, "link", e.target.value)
                        }
                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      {editingSession.presenter.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePresenter(index)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isEditing ? "Update" : "Create"} Session
                </button>
              </div>
            </form>
          </Modal>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paper Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presenter(s)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session, sessionIndex) => (
                  <tr
                    key={session._id || `session-${sessionIndex}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {session.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <a
                        href={session.paperLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {session.paperTitle}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {session.presenter.map((p, idx) => (
                        <div
                          key={`${
                            session._id || sessionIndex
                          }-presenter-${idx}`}
                        >
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {p.name}
                          </a>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.academicYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(session)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(session._id!)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No PRG sessions found.</p>
            <button
              onClick={handleOpenAddModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add First Session
            </button>
          </div>
        )}
      </main>
    </Layout>
  );
}
