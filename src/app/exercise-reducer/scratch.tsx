import { Button } from "@/components/ui/button";
import { createContext, use, useEffect, useReducer } from "react";

// Context
const FlowContext = createContext<{
  state: FlowState;
  dispatch: (action: FlowAction) => void;
}>({
  state: {
    status: "search",
    results: undefined,
  },
  dispatch: () => {},
});

// hook to use this context inside the users
// export function useFlowContext() {
//   const context = use(FlowContext);
//   if (!context) throw new Error("No context provided");
//   return context;
// }

// Actual Content to display
function FlowContent() {
  const { state } = use(FlowContext);

  return (
    <div>
      {state.status === "search" && <SearchView />}
      {state.status === "loading" && <LoadingView />}
      {state.status === "results" && <ResultsView />}
    </div>
  );
}

// Provider
const FlowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(flowReducer, {
    status: "search",
    results: undefined,
  });

  useEffect(() => {
    if (state.status === "loading") {
      const id = setTimeout(() => {
        dispatch({ type: "receivedResults", results: ["1", "2"] });
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [state.status]);

  return (
    <FlowContext.Provider value={{ state, dispatch }}>
      {children}
    </FlowContext.Provider>
  );
};

//Page
export default function Page() {
  return (
    <FlowProvider>
      <FlowContent />
    </FlowProvider>
  );
}

//Loading View
function LoadingView() {
  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}

//Search View
function SearchView() {
  const { dispatch } = use(FlowContext);

  return (
    <div>
      <h1>Search for stuff</h1>
      <Button onClick={() => dispatch({ type: "search" })}>Search</Button>
    </div>
  );
}

//Results View
function ResultsView() {
  const { state, dispatch } = use(FlowContext);

  if (state.status !== "results") {
    // hopefully we never get here
    return <div>Error: something went wrong</div>;
  }

  return (
    <div>
      <h1>Results</h1>
      {state.results.map((result) => (
        <div key={result}>{result}</div>
      ))}
      <Button onClick={() => dispatch({ type: "back" })}>Back</Button>
    </div>
  );
}

type FlowState = {
  results: string[] | undefined;
} & (
  | {
      status: "search";
      results?: any[] | undefined;
    }
  | {
      status: "loading";
    }
  | {
      status: "results";
      results: string[];
    }
);

type FlowAction =
  | {
      type: "search";
    }
  | {
      type: "receivedResults";
      results: string[];
    }
  | {
      type: "back";
    };

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "search":
      return {
        ...state,
        status: "loading",
      };
    case "receivedResults":
      return {
        ...state,
        status: "results",
        results: action.results,
      };
    case "back":
      return {
        ...state,
        status: "search",
      };
    default:
      return state;
  }
}
