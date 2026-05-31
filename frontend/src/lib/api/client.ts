import { browser } from '$app/environment';
import type { LoginResponse } from '$lib/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshPromise: Promise<void> | null = null;

export function initTokens() {
  if (browser) {
    accessToken = localStorage.getItem('accessToken');
    refreshToken = localStorage.getItem('refreshToken');
  }
}

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  if (browser) {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (browser) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

export function getAccessToken() {
  return accessToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let response = await fetch(`${API_URL}${path}`, { ...options, headers, signal: controller.signal }).finally(() => clearTimeout(timeout));

  if (response.status === 401 && refreshToken) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const resp = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (!resp.ok) {
          clearTokens();
          if (browser) window.location.href = '/login';
          throw new Error('Sesión expirada');
        }
        const data = await resp.json();
        setTokens(data.accessToken, refreshToken);
      })().finally(() => { refreshPromise = null; });
    }
    await refreshPromise;
    headers['Authorization'] = `Bearer ${accessToken}`;
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error del servidor' }));
    throw new Error(error.message || 'Error del servidor');
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    profile: () => request<any>('/auth/profile'),
  },
  dependencias: {
    list: () => request<any[]>('/dependencias'),
    create: (data: any) => request<any>('/dependencias', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/dependencias/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) => request<any>(`/dependencias/${id}`, { method: 'DELETE' }),
  },
  procesos: {
    list: () => request<any[]>('/procesos'),
    create: (data: any) => request<any>('/procesos', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/procesos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) => request<any>(`/procesos/${id}`, { method: 'DELETE' }),
  },
  macroprocesos: {
    list: () => request<any[]>('/macroprocesos'),
    findByDependencia: (dependenciaId: string) => request<any[]>(`/macroprocesos/por-dependencia/${dependenciaId}`),
  },
  subprocesos: {
    list: () => request<any[]>('/subprocesos'),
    findByProceso: (procesoId: string) => request<any[]>(`/subprocesos/por-proceso/${procesoId}`),
  },
  activos: {
    list: () => request<any[]>('/activos'),
    create: (data: any) => request<any>('/activos', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/activos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) => request<any>(`/activos/${id}`, { method: 'DELETE' }),
  },
  riesgos: {
    list: () => request<any[]>('/riesgos'),
    create: (data: any) => request<any>('/riesgos', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/riesgos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    getById: (id: string) => request<any>(`/riesgos/${id}`),
  },
  evaluaciones: {
    list: () => request<any[]>('/evaluaciones'),
    create: (data: any) => request<any>('/evaluaciones', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/evaluaciones/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    findByRiesgo: (riesgoId: string) => request<any[]>(`/evaluaciones/riesgo/${riesgoId}`),
  },
  controles: {
    list: () => request<any[]>('/controles'),
    create: (data: any) => request<any>('/controles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/controles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) => request<any>(`/controles/${id}`, { method: 'DELETE' }),
    findByEvaluacion: (evaluacionId: string) => request<any[]>(`/controles/evaluacion/${evaluacionId}`),
  },
  usuarios: {
    list: () => request<any[]>('/usuarios'),
    create: (data: any) => request<any>('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/usuarios/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  reportes: {
    riesgosPorProceso: () => request<any[]>('/reportes/riesgos-por-proceso'),
    riesgosPorDependencia: () => request<any[]>('/reportes/riesgos-por-dependencia'),
    riesgosAltos: () => request<any[]>('/reportes/riesgos-altos'),
  },
  planesAccion: {
    list: () => request<any[]>('/planes-accion'),
    create: (data: any) => request<any>('/planes-accion', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/planes-accion/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    findByRiesgo: (riesgoId: string) => request<any[]>(`/planes-accion/riesgo/${riesgoId}`),
  },
};
