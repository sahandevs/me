import React from "react";
import { Container, Typography, Box, Chip, Card, CardActionArea } from "@material-ui/core";
import "./App.css";
// TODO: look at this color plette https://colorhunt.co/palette/159988
function Header() {
  const context = useAppContext();

  function buildTitles(titles: string[], selected: string) {
    const _titles = titles.filter(x => x !== selected);
    return [..._titles, selected].map(title => {
      const isSelected = selected === title;
      return (
        <Typography
          key={`title_${title}`}
          variant="h2"
          color="primary"
          component="span"
          style={{
            position: isSelected ? "relative" : "absolute",
            transform: isSelected ? "translate(0px)" : "translate(-300px)",
            transition: "300ms",
            opacity: isSelected ? 1.0 : 0.0
          }}
        >
          {title}
        </Typography>
      );
    });
  }

  return (
    <Typography variant="h3" component="div" style={{ fontWeight: 300 }}>
      {`Hi! I'm Sahand`}
      <br />
      <Typography variant="h2" component="span">{`and I'm a `}</Typography>
      {buildTitles(
        context.filter.filterDefinitions.map(v => v.headerName), //
        context.filter.currentFilter.headerName
      )}
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
  const context = useAppContext();

  function buildProjects(projects: Project[]) {
    return projects.map((project, i) => (
      <Card key={`project_${i}`} style={{ minWidth: 230, minHeight: 120, marginLeft: 10, marginTop: 10 }}>
        <CardActionArea>
          <Typography variant="h6">{project.name}</Typography>
        </CardActionArea>
      </Card>
    ));
  }

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      flexDirection="row"
      margin="30px"
      //
    >
      {buildProjects(context.project.currentFilterProjects)}
    </Box>
  );
}

const App: React.FC = () => {
  const [appContext, setAppContext] = React.useState<AppContextProps>(() => {
    return {
      filter: {
        filterDefinitions: filters,
        selectedFilterId: filters[0].id,
        setFilter
      },
      project: {
        allProjects: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
          return {
            name: `Project #${i}`,
            canBeFilterBy: [filtersByName.mobile]
          };
        })
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

type Project = {
  name: string;
  canBeFilterBy: FilterDefinition[];
};

type FilterDefinition = {
  name: string;
  id: string;
  headerName: string;
};

const filtersByName = {
  mobile: { name: "Android / iOS", id: "mobile", headerName: "Mobile Application" },
  web: { name: "Web", id: "web", headerName: "Frontend" },
  backend: { name: "Backend", id: "backend", headerName: "Backend" },
  others: { name: "Other / Researches", id: "other", headerName: "" }
};

const filters: FilterDefinition[] = [
  filtersByName.mobile,
  filtersByName.web,
  filtersByName.backend,
  filtersByName.others
];

type AppContextProps = {
  filter: {
    filterDefinitions: FilterDefinition[];
    selectedFilterId: string;
    setFilter: (filter: FilterDefinition) => void;
  };
  project: {
    allProjects: Project[];
  };
};

// @ts-ignore
const AppContext = React.createContext<AppContextProps>();

function useAppContext() {
  const context = React.useContext<AppContextProps>(AppContext);

  function _currentFilter() {
    return context.filter.filterDefinitions.find(x => x.id === context.filter.selectedFilterId)!;
  }

  return {
    ...context,
    filter: {
      ...context.filter,
      get currentFilter() {
        return _currentFilter();
      }
    },
    project: {
      ...context.project,
      get currentFilterProjects() {
        return context.project.allProjects.filter(
          x => x.canBeFilterBy.includes(_currentFilter()) || x.canBeFilterBy.length === 0
        );
      }
    }
  };
}

export default App;
