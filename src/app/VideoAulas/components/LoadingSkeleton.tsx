// src/app/VideoAulas/components/LoadingSkeleton.tsx
"use client";

import { motion } from "framer-motion";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse" />
            <div>
              <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-slate-800/50 rounded-lg animate-pulse mt-1" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 animate-pulse" />
            <div className="w-8 h-8 rounded-lg bg-slate-800 animate-pulse" />
            <div className="w-8 h-8 rounded-lg bg-slate-800 animate-pulse" />
          </div>
        </div>

        {/* Barra de progresso global skeleton */}
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <div className="h-3 w-24 bg-slate-800 rounded animate-pulse" />
            <div className="h-3 w-12 bg-slate-800 rounded animate-pulse" />
          </div>
          <div className="h-2 bg-slate-800 rounded-full animate-pulse" />
        </div>
      </motion.div>

      {/* Badges skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-slate-800/40 border border-white/5 animate-pulse"
          >
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-slate-700" />
            <div className="h-4 w-20 mx-auto bg-slate-700 rounded mb-1" />
            <div className="h-3 w-28 mx-auto bg-slate-700/50 rounded" />
          </div>
        ))}
      </div>

      {/* Search bar skeleton */}
      <div className="relative mb-6">
        <div className="w-full h-11 rounded-xl bg-slate-800/50 border border-white/10 animate-pulse" />
      </div>

      {/* Categorias skeleton */}
      {[1, 2, 3].map((catIdx) => (
        <div
          key={catIdx}
          className="rounded-xl bg-slate-800/40 backdrop-blur-sm border border-white/10 overflow-hidden"
        >
          {/* Header da categoria */}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse" />
                <div className="h-6 w-40 bg-slate-700 rounded-lg animate-pulse" />
                <div className="h-5 w-16 bg-slate-700 rounded-full animate-pulse" />
              </div>
              <div className="w-5 h-5 bg-slate-700 rounded animate-pulse" />
            </div>

            {/* Barra de progresso da categoria */}
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <div className="h-3 w-20 bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-16 bg-slate-700 rounded animate-pulse" />
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="px-5 pb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="h-16 bg-slate-700/50 rounded-lg animate-pulse" />
              <div className="h-16 bg-slate-700/50 rounded-lg animate-pulse" />
            </div>
            <div className="h-24 bg-slate-700/30 rounded-lg animate-pulse" />
          </div>

          {/* Grid de vídeos skeleton */}
          <div className="border-t border-white/10 p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2].map((videoIdx) => (
                <div
                  key={videoIdx}
                  className="rounded-xl overflow-hidden bg-slate-700/30 animate-pulse"
                >
                  {/* Thumbnail skeleton */}
                  <div className="aspect-video bg-slate-700" />
                  {/* Content skeleton */}
                  <div className="p-3 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-700 rounded" />
                    <div className="h-3 w-full bg-slate-700/50 rounded" />
                    <div className="flex items-center gap-2 pt-2">
                      <div className="h-3 w-16 bg-slate-700 rounded" />
                      <div className="w-6 h-6 rounded-full bg-slate-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Footer dica skeleton */}
      <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
        <div className="h-4 w-full bg-slate-700/30 rounded animate-pulse" />
      </div>
    </div>
  );
}
