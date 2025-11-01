import { T } from "vitest/dist/chunks/reporters.d.C-cu31ET.js";
import { create } from "zustand";

// Types
interface TodoItem {
  id: string;
  text: string;
}

interface Destination {
  id: string;
  name: string;
}

interface ItineraryState {
  destinations: Destination[];
  todos: TodoItem[];
  addTodo: (todo: TodoItem) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, data: Partial<TodoItem>) => void;
  addDestination: (destination: Destination) => void;
  removeDestination: (id: string) => void;
  updateDestination: (id: string, data: Partial<Destination>) => void;
}

const useItineraryStore = create<ItineraryState>((set) => ({
  todos: [],
  destinations: [],
  addTodo: (todo: TodoItem) => set((state) => ([...state.todos, todo]))
  removeTodo: (id: string) => set((state) => state.todos.filter((t) =>t.id !== id)),
  updateTodo: (id: string, data: Partial<TodoItem>) => set((state) => state.todos.map(t)=> t.id === id ? {...t, data } : t)
  addDestination: (destination: Destination) => set((state) => [...state.destinations, destination])
  removeDestination: (id: string) => set((state) => state.destinations.filter((t) =>t.id !== id))
  updateDestination: (id: string, data: Partial<Destination>) => set((state) => state.destinations.map((el)=> el.id === id ? {...el, ...data } : el))
}));

export default useItineraryStore;
