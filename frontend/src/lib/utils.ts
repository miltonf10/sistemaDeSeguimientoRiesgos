import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { HTMLAttributes } from "svelte/elements";
import type { Snippet } from "svelte";

export type WithElementRef<T> = T & {
	ref?: HTMLElement | null;
};

export type WithoutChildrenOrChild<T> = T extends { children: Snippet } ? Omit<T, "children" | "child"> : T extends { child: any } ? Omit<T, "child" | "children"> : T;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
