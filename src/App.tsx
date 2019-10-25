import React from "react";
import { Container, Typography, Box, Chip } from "@material-ui/core";
import "./App.css";

function Header() {
  const context = useAppContext();

  return (
    <Typography variant="h3" component="span" style={{ fontWeight: 300 }}>
      {`Hi! I'm Sahand`}
      <br />
      <Typography variant="h2" component="span">{`and I'm a `}</Typography>
      <Typography variant="h2" color="primary" component="span">
        {context.filter.currentFilter.headerName}
      </Typography>
      <Typography variant="h2" component="span">{` Developer`}</Typography>
    </Typography>
  );
}

function Filters() {
  const context = useAppContext();

  function buildChips(filters: FilterDefinition[]) {
    return filters.map((filter, i) => {
      const isSelected = context.filter.selectedFilterId === filter.id;
      const isFirst = i === 0;
      return (
        <Chip
          key={`filter_${i}`}
          color={isSelected ? "primary" : "default"}
          label={filter.name}
          style={{ marginLeft: isFirst ? "0rem" : "0.5rem" }}
          clickable={!isSelected}
          onClick={() => context.filter.setFilter(filter)}
        />
      );
    });
  }

  return (
    <Box display="flex" flexDirection="row" marginTop={"1rem"}>
      {buildChips(context.filter.filterDefinitions)}
    </Box>
  );
}

function Projects() {
  return <h4>{"this is the projects section"}</h4>;
}

const App: React.FC = () => {
  const [appContext, setAppContext] = React.useState<AppContextProps>(() => {
    return {
      filter: {
        filterDefinitions: filters,
        selectedFilterId: filters[0].id,
        setFilter
      }
    };
  });

  function setFilter(filter: FilterDefinition) {
    setAppContext({
      ...appContext,
      filter: {
        ...appContext.filter,
        selectedFilterId: filter.id
      }
    });
  }

  return (
    <AppContext.Provider value={appContext}>
      <Container style={{ paddingTop: 40 }}>
        <Header />
        <Filters />
        <Projects />
      </Container>
    </AppContext.Provider>
  );
};

type FilterDefinition = {
  name: string;
  id: string;
  headerName: string;
};

const filters: FilterDefinition[] = [
  { name: "Mobile", id: "mobile", headerName: "Mobile Application" },
  { name: "Web", id: "web", headerName: "Frontend" },
  { name: "Backend", id: "backend", headerName: "Frontend" },
  { name: "Other / Researches", id: "other", headerName: "" }
];

type AppContextProps = {
  filter: {
    filterDefinitions: FilterDefinition[];
    selectedFilterId: string;
    setFilter: (filter: FilterDefinition) => void;
  };
};

// @ts-ignore
const AppContext = React.createContext<AppContextProps>();

function useAppContext() {
  const context = React.useContext<AppContextProps>(AppContext);
  return {
    ...context,
    filter: {
      ...context.filter,
      get currentFilter() {
        return context.filter.filterDefinitions.find(x => x.id === context.filter.selectedFilterId)!;
      }
    }
  };
}

export default App;
