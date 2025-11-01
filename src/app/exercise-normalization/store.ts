import { create } from "zustand";

// Types
interface TodoItem {
  id: string;
  text: string;
  destinationId: string;
}

interface Destination {
  id: string;
  name: string;
}

interface ItineraryState {
  destinations: Destination[];
  todos: TodoItem[];
  addTodo: (destinationId: string, text: string) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, data: Partial<TodoItem>) => void;
  addDestination: (destination: Destination) => void;
  removeDestination: (id: string) => void;
  updateDestination: (id: string, data: Partial<Destination>) => void;
}

const useItineraryStore = create<ItineraryState>((set) => ({
  todos: [],
  destinations: [],
  addTodo: (destinationId: string, text: string) =>
    set((state) => ({
      todos: [...state.todos, { id: crypto.randomUUID(), text, destinationId }],
    })),
  removeTodo: (id: string) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
  updateTodo: (id: string, data: Partial<TodoItem>) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  addDestination: (destination: Destination) =>
    set((state) => ({
      destinations: [...state.destinations, destination],
    })),
  removeDestination: (id: string) =>
    set((state) => ({
      destinations: state.destinations.filter((t) => t.id !== id),
      todos: state.todos.filter((t) => t.destinationId !== id),
    })),
  updateDestination: (id: string, data: Partial<Destination>) =>
    set((state) => ({
      destinations: state.destinations.map((el) =>
        el.id === id ? { ...el, ...data } : el
      ),
    })),
}));

export default useItineraryStore;
