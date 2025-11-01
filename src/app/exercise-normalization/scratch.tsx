"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, MapPin, CheckSquare } from "lucide-react";
import useItineraryStore from "./store";

export default function ItineraryPage() {
  const addDestination = useItineraryStore((state) => state.addDestination);
  const addTodo = useItineraryStore((state) => state.addTodo);
  const removeTodo = useItineraryStore((state) => state.removeTodo);
  const removeDestination = useItineraryStore(
    (state) => state.removeDestination
  );
  const updateDestination = useItineraryStore(
    (state) => state.updateDestination
  );
  const lastInputRef = useRef<HTMLInputElement>(null);

  const todos = useItineraryStore((state) => state.todos);
  const destinations = useItineraryStore((state) => state.destinations);

  const handleAddDestination = () => {
    addDestination({ id: crypto.randomUUID(), name: "" });
    // Focus the new input after render
    setTimeout(() => {
      lastInputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            Travel Itinerary
          </h1>
        </div>

        <Button onClick={handleAddDestination} size="lg" className="mb-6">
          <Plus className="h-4 w-4" />
          Add Destination
        </Button>

        <div className="space-y-6">
          {destinations.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No destinations yet. Click &ldquo;Add Destination&rdquo; to
                  start planning your trip!
                </p>
              </CardContent>
            </Card>
          ) : (
            destinations.map((destination, index) => (
              <Card key={destination.id} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="flex-1">
                      <Input
                        type="text"
                        value={destination.name}
                        onChange={(e) =>
                          updateDestination(destination.id, {
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter destination name"
                        className="text-lg font-semibold border-none px-0 focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-primary rounded-none"
                        ref={
                          index === destinations.length - 1
                            ? lastInputRef
                            : null
                        }
                      />
                    </CardTitle>
                  </div>
                  <CardAction>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDestination(destination.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardAction>
                </CardHeader>

                <CardContent className="space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const input = form.elements.namedItem(
                        "todo"
                      ) as HTMLInputElement;
                      if (input.value.trim()) {
                        addTodo(destination.id, input.value.trim());
                        input.value = "";
                      }
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      type="text"
                      name="todo"
                      placeholder="Add a todo item (e.g., Visit museum, Try local cuisine)"
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </form>

                  {todos.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Things to do
                        </span>
                        <Badge variant="secondary">{todos.length}</Badge>
                      </div>
                      <ul className="space-y-2">
                        {todos.map((todo) => (
                          <li
                            key={todo.id}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            <span className="flex-1 text-sm">{todo.text}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTodo(todo.id)}
                              className="text-muted-foreground hover:text-destructive h-auto p-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No activities added yet. Add some things to do at this
                      destination!
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-6 border-t">
        <Button variant="outline" disabled>
          Undo
        </Button>
        <Button variant="outline" disabled>
          Redo
        </Button>
      </div>
    </div>
  );
}
