import { Presentation } from "@/components/presentation";
import type { SlideDefinition } from "@/components/presentation";
import { StandalonePrototype } from "@/components/prototype";
import { StandaloneCover } from "@/components/prototype/StandaloneCover";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  TitleSlide,
  BriefSlide,
  UsersSlide,
  problemSteps,
  DesignBenchmarkingSlide,
  OpportunitySlide,
  PrinciplesSlide,
  BrandEvolutionSlide,
  InformationArchitectureSlide,
  UserFlowsSlide,
  homeScreenSteps,
  searchSteps,
  mapHousingSteps,
  postDetailSteps,
  replyChatSteps,
  InteractionDesignSlide,
  NextStepsSlide,
  SummarySlide,
  ThankYouSlide,
} from "@/slides";

const slides: SlideDefinition[] = [
  { id: "title", title: "Cover", content: <TitleSlide /> },
  { id: "brief", title: "The Brief", content: <BriefSlide /> },
  { id: "users", title: "Our Users", content: <UsersSlide /> },
  { id: "problem", title: "The Current Experience", prototypeSteps: problemSteps, flipped: true },
  { id: "benchmarking", title: "Design Benchmarking", content: <DesignBenchmarkingSlide /> },
  { id: "opportunity", title: "The Opportunity", content: <OpportunitySlide /> },
  { id: "principles", title: "Design Principles", content: <PrinciplesSlide /> },
  { id: "brand", title: "Brand Authenticity", content: <BrandEvolutionSlide /> },
  { id: "ia", title: "Information Architecture", content: <InformationArchitectureSlide /> },
  { id: "flows", title: "User Flows", content: <UserFlowsSlide /> },
  { id: "home-screen", title: "Home Screen", prototypeSteps: homeScreenSteps },
  { id: "search-journey", title: "Search Journey", prototypeSteps: searchSteps },
  { id: "map-housing", title: "Map Journey", prototypeSteps: mapHousingSteps },
  { id: "post-detail", title: "Post Details", prototypeSteps: postDetailSteps },
  { id: "reply-chat", title: "Reply & Chat", prototypeSteps: replyChatSteps },
  { id: "interaction", title: "Interaction Design", content: <InteractionDesignSlide /> },
  { id: "next-steps", title: "Next Steps", content: <NextStepsSlide /> },
  { id: "summary", title: "Summary", content: <SummarySlide /> },
  { id: "thank-you", title: "Thank You", content: <ThankYouSlide /> },
];

function App() {
  const isPresentation = useMediaQuery("(min-width: 1280px)");

  if (!isPresentation) {
    return (
      <>
        <StandalonePrototype />
        <StandaloneCover />
      </>
    );
  }

  return <Presentation slides={slides} />;
}

export default App;
