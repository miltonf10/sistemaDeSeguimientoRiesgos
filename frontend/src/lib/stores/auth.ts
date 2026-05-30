import { writable } from 'svelte/store';
import type { Usuario } from '$lib/types';

export const currentUser = writable<Usuario | null>(null);
export const isAuthenticated = writable<boolean>(false);
