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
    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-red-700 font-semibold">
          Projects ({projects.length})
        </div>
        <div>
          <button
            onClick={() => startEdit()}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-sm tap-target transition-smooth focus-ring-red"
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
            <ul className="space-y-3">
              {projects.map((p: any) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:shadow-md transition-smooth bg-white"
                >
                  <div>
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="text-red-600 font-medium mr-2">
                        {p.code}
                      </span>
                      <span className="text-gray-500">{p.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-sm text-red-600 hover:underline tap-target transition-smooth"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-sm text-gray-500 hover:text-red-600 tap-target transition-smooth"
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
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold mb-3 text-gray-900">
              Project details
            </h3>
            <div className="space-y-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="Code"
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(form.active)}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="accent-red-600"
                />
                Active
              </label>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={save}
                  className="bg-red-600 text-white px-3 py-1 rounded-md shadow"
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
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md border"
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
