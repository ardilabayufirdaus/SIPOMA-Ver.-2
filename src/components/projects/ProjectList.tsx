"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Project = {
  id?: number | string;
  name: string;
  code?: string;
  description?: string;
  active?: boolean;
};

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Project>({
    name: "",
    code: "",
    description: "",
    active: true,
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, code, description, active")
        .order("name", { ascending: true });
      if (error) throw error;
      setProjects((data as any) || []);
    } catch (err) {
      console.error("fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const startEdit = (p?: Project) => {
    if (p) setEditing(p);
    setForm(
      p ? { ...p } : { name: "", code: "", description: "", active: true }
    );
  };

  const save = async () => {
    try {
      if (!form.name) return;
      if (editing && editing.id) {
        const { error } = await supabase
          .from("projects")
          .update({
            name: form.name,
            code: form.code,
            description: form.description,
            active: form.active,
          })
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert({
          name: form.name,
          code: form.code,
          description: form.description,
          active: form.active,
        });
        if (error) throw error;
      }
      setEditing(null);
      setForm({ name: "", code: "", description: "", active: true });
      fetchProjects();
    } catch (err) {
      console.error("save project", err);
    }
  };

  const remove = async (id: number | string) => {
    if (!confirm("Hapus project ini?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      fetchProjects();
    } catch (err) {
      console.error("delete project", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Projects ({projects.length})
        </div>
        <div>
          <button
            onClick={() => startEdit()}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            + New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : projects.length === 0 ? (
            <div className="text-sm text-gray-500">No projects yet</div>
          ) : (
            <ul className="space-y-2">
              {projects.map((p: any) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      {p.code} • {p.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-sm text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="text-sm font-semibold mb-2">Project details</h3>
            <div className="space-y-2">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full border rounded px-2 py-1"
              />
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="Code"
                className="w-full border rounded px-2 py-1"
              />
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                className="w-full border rounded px-2 py-1"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(form.active)}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                />{" "}
                Active
              </label>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={save}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(null);
                    setForm({
                      name: "",
                      code: "",
                      description: "",
                      active: true,
                    });
                  }}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
