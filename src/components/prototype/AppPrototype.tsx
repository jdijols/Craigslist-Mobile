import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "./AppShell";
import { SPRING_SHEET } from "./transitions";
import { SCREEN_DEPTH } from "./types";
import type { ScreenId } from "./types";
import type { ViewMode } from "../ui/cards/types";
import type { PostDetailVariantId, PostDetailVariant } from "../../data/listings";
import { listingToDetailVariant } from "../../data/listings";
import type { ListingData } from "../ui/cards/types";
import { useChatThreads, addChatThread } from "../../data/chats";
import type { ChatThread as ChatThreadData } from "../../data/chats";
import {
  HomeScreen,
  SearchScreen,
  FavoritesScreen,
  PostDetail,
  MyListings,
  CreatePost,
  ChatsScreen,
  ChatThread,
} from "./screens";
import { addRecentSearch } from "../../data/recentSearches";
import { getCategoryById } from "../../data/categories";
import type { SavedSearch } from "../../data/savedSearches";
import { LocationProvider } from "../../contexts/LocationContext";

const SCREENS: Record<ScreenId, React.ComponentType<{ onNavigate?: (s: ScreenId) => void }>> = {
  home: HomeScreen as React.ComponentType<{ onNavigate?: (s: ScreenId) => void }>,
  search: SearchScreen,
  saved: FavoritesScreen,
  "post-detail": PostDetail,
  "my-listings": MyListings,
  "create-post": CreatePost,
  chat: ChatsScreen,
  "chat-thread": ChatThread as React.ComponentType<{ onNavigate?: (s: ScreenId) => void }>,
};

const HIDE_TAB_BAR: Set<ScreenId> = new Set(["chat-thread"]);
const MODAL_SCREENS = new Set<ScreenId>(["create-post", "post-detail"]);

interface AppPrototypeProps {
  screen: ScreenId;
  onNavigate?: (screen: ScreenId) => void;
  postDetailVariant?: PostDetailVariantId;
  homeCategory?: string;
  homeSubcategory?: string;
  homeSubcategoryDrawerOpen?: boolean;
  homeViewMode?: ViewMode;
}

export function AppPrototype({ screen, onNavigate, postDetailVariant, homeCategory, homeSubcategory, homeSubcategoryDrawerOpen, homeViewMode }: AppPrototypeProps) {
  const [settled, setSettled] = useState<ScreenId>(
    MODAL_SCREENS.has(screen) ? "home" : screen
  );

  const [homeActiveCategory, setHomeActiveCategory] = useState("all CL");
  const [homeActiveSubcategory, setHomeActiveSubcategory] = useState<string | null>(null);
  const [homeResetSignal, setHomeResetSignal] = useState(0);
  const lastBaseRef = useRef<ScreenId>(
    MODAL_SCREENS.has(screen) ? "home" : screen
  );

  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchPlaceholder, setSearchPlaceholder] = useState("search craigslist");
  const searchOriginRef = useRef<ScreenId>("home");
  const searchResetCategoryRef = useRef(false);

  const [restoreSignal, setRestoreSignal] = useState(0);
  const restoreDataRef = useRef<{
    sortBy?: string;
    distance?: string;
    minPrice?: string;
    maxPrice?: string;
  } | null>(null);

  const [activeVariant, setActiveVariant] = useState<PostDetailVariantId>(
    postDetailVariant ?? "dresser"
  );
  const allChatThreads = useChatThreads();
  const [activeChatThread, setActiveChatThread] = useState<ChatThreadData | null>(allChatThreads[0] ?? null);
  const [activeListing, setActiveListing] = useState<ListingData | null>(null);
  const [createPostKey, setCreatePostKey] = useState(0);

  useEffect(() => {
    if (postDetailVariant) setActiveVariant(postDetailVariant);
  }, [postDetailVariant]);

  useEffect(() => {
    if (homeCategory != null) setHomeActiveCategory(homeCategory);
    if (homeSubcategory !== undefined) setHomeActiveSubcategory(homeSubcategory);
  }, [homeCategory, homeSubcategory]);

  const isModal = MODAL_SCREENS.has(screen);

  useEffect(() => {
    if (!isModal) {
      lastBaseRef.current = screen;
    }
  }, [screen, isModal]);

  const isPush = !isModal && SCREEN_DEPTH[screen] > SCREEN_DEPTH[settled];
  const isPop = !isModal && SCREEN_DEPTH[screen] < SCREEN_DEPTH[settled];

  useEffect(() => {
    if (!isModal && screen !== settled && !isPush && !isPop) {
      setSettled(screen);
    }
  }, [screen, settled, isPush, isPop, isModal]);

  const handleNavigate = useCallback(
    (target: ScreenId) => {
      if (target === "home" && screen === "home") {
        if (homeActiveCategory === "all CL" && !homeActiveSubcategory && !searchTerm) {
          setHomeResetSignal((s) => s + 1);
          return;
        }
        setHomeActiveCategory("all CL");
        setHomeActiveSubcategory(null);
        setSearchTerm(null);
        return;
      }

      if (target === "create-post") {
        setCreatePostKey((k) => k + 1);
      }

      if (target === "search") {
        if (screen === "home") {
          searchOriginRef.current = screen;
          searchResetCategoryRef.current = false;
          if (homeActiveSubcategory) {
            setSearchPlaceholder(`search ${homeActiveSubcategory.toLowerCase()}`);
          } else if (homeActiveCategory !== "all CL") {
            setSearchPlaceholder(`search ${homeActiveCategory.toLowerCase()}`);
          } else {
            setSearchPlaceholder("search craigslist");
          }
        } else {
          searchOriginRef.current = screen;
          searchResetCategoryRef.current = true;
          setSearchPlaceholder("search craigslist");
        }
      }

      onNavigate?.(target);
    },
    [screen, onNavigate, homeActiveCategory, homeActiveSubcategory, searchTerm],
  );

  const handleSubmitSearch = useCallback(
    (term: string) => {
      addRecentSearch({
        term,
        category: homeActiveCategory !== "all CL" ? homeActiveCategory : undefined,
        subcategory: homeActiveSubcategory ?? undefined,
      });
      if (searchResetCategoryRef.current) {
        setHomeActiveCategory("all CL");
        setHomeActiveSubcategory(null);
      }
      setSearchTerm(term);
      onNavigate?.("home");
    },
    [onNavigate, homeActiveCategory, homeActiveSubcategory],
  );

  const handleCancelSearch = useCallback(() => {
    setSearchTerm(null);
    onNavigate?.(searchOriginRef.current);
  }, [onNavigate]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm(null);
  }, []);

  const handleBrowseCategory = useCallback(
    (category: string, subcategory: string) => {
      setSearchTerm(null);
      setHomeActiveCategory(category);
      setHomeActiveSubcategory(subcategory);
      onNavigate?.("home");
    },
    [onNavigate],
  );

  const handleRestoreSavedSearch = useCallback(
    (search: SavedSearch) => {
      const cat = getCategoryById(search.category);
      const chipLabel = cat ? cat.name.toLowerCase() : search.category;
      setHomeActiveCategory(chipLabel);
      setHomeActiveSubcategory(search.subcategory ?? null);
      setSearchTerm(search.searchTerm ?? null);
      restoreDataRef.current = {
        sortBy: search.sortBy,
        distance: search.filters?.distance,
        minPrice: search.filters?.minPrice,
        maxPrice: search.filters?.maxPrice,
      };
      setRestoreSignal((s) => s + 1);
      onNavigate?.("home");
    },
    [onNavigate],
  );

  const handleOpenListing = useCallback(
    (listing: ListingData) => {
      setActiveListing(listing);
      onNavigate?.("post-detail");
    },
    [onNavigate],
  );

  const handleReplySubmit = useCallback(
    (message: string, variant: PostDetailVariant) => {
      const id = `thread-${Date.now()}`;
      const newThread: ChatThreadData = {
        id,
        posterName: variant.title,
        posterInitial: (variant.title[0] ?? "?").toUpperCase(),
        listingTitle: variant.title,
        listingCategory: variant.categoryLabel ?? "for sale",
        listingSubcategory: "",
        lastMessage: message,
        timestamp: "just now",
        unread: false,
        messages: [
          { id: `${id}-msg-1`, fromUser: true, text: message, timestamp: "just now" },
        ],
      };
      addChatThread(newThread);
      setActiveChatThread(newThread);
      onNavigate?.("chat-thread");
    },
    [onNavigate],
  );

  const handleOpenThread = useCallback(
    (thread: ChatThreadData) => {
      setActiveChatThread(thread);
      onNavigate?.("chat-thread");
    },
    [onNavigate],
  );

  const shellScreen = isModal ? settled : screen;
  const hideTabBar = HIDE_TAB_BAR.has(shellScreen);

  const BaseComponent = SCREENS[isModal ? settled : screen];
  const OverlayComponent =
    !isModal && (isPush || isPop)
      ? SCREENS[isPush ? screen : settled]
      : null;

  const handleModalDismiss = useCallback(() => {
    setActiveListing(null);
    onNavigate?.(lastBaseRef.current);
  }, [onNavigate]);

  const renderScreen = useCallback(
    (Component: React.ComponentType<{ onNavigate?: (s: ScreenId) => void }>) => {
      if (Component === HomeScreen) {
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            onOpenListing={handleOpenListing}
            activeCategory={homeActiveCategory}
            onCategoryChange={setHomeActiveCategory}
            activeSubcategory={homeActiveSubcategory}
            onSubcategoryChange={setHomeActiveSubcategory}
            searchTerm={searchTerm}
            onClearSearch={handleClearSearch}
            resetSignal={homeResetSignal}
            restoreSignal={restoreSignal}
            restoreDataRef={restoreDataRef}
            initialViewMode={homeViewMode}
            initialSubcategoryDrawerOpen={homeSubcategoryDrawerOpen}
          />
        );
      }
      if (Component === SearchScreen) {
        return (
          <SearchScreen
            onNavigate={handleNavigate}
            searchTerm={searchTerm}
            searchPlaceholder={searchPlaceholder}
            onSubmitSearch={handleSubmitSearch}
            onCancelSearch={handleCancelSearch}
            onBrowseCategory={handleBrowseCategory}
            onRestoreSavedSearch={handleRestoreSavedSearch}
          />
        );
      }
      if (Component === (FavoritesScreen as React.ComponentType)) {
        return (
          <FavoritesScreen
            onNavigate={handleNavigate}
            onOpenListing={handleOpenListing}
          />
        );
      }
      if (Component === (PostDetail as React.ComponentType)) {
        return (
          <PostDetail
            onNavigate={handleNavigate}
            onReplySubmit={handleReplySubmit}
            variantId={activeVariant}
            variant={activeListing ? listingToDetailVariant(activeListing) : undefined}
            listing={activeListing}
          />
        );
      }
      if (Component === (ChatThread as React.ComponentType)) {
        if (!activeChatThread) return <ChatsScreen onNavigate={handleNavigate} onOpenThread={handleOpenThread} />;
        return (
          <ChatThread
            thread={activeChatThread}
            onNavigate={handleNavigate}
          />
        );
      }
      if (Component === (ChatsScreen as React.ComponentType)) {
        return (
          <ChatsScreen
            onNavigate={handleNavigate}
            onOpenThread={handleOpenThread}
          />
        );
      }
      return <Component onNavigate={handleNavigate} />;
    },
    [
      handleNavigate,
      handleOpenListing,
      handleReplySubmit,
      handleOpenThread,
      homeActiveCategory,
      homeActiveSubcategory,
      searchTerm,
      searchPlaceholder,
      handleClearSearch,
      handleSubmitSearch,
      handleCancelSearch,
      handleBrowseCategory,
      handleRestoreSavedSearch,
      activeVariant,
      activeListing,
      activeChatThread,
      homeResetSignal,
      restoreSignal,
      homeViewMode,
      homeSubcategoryDrawerOpen,
    ],
  );

  const showHomeLayer = screen === "home" || settled === "home";

  return (
    <LocationProvider>
      <div className="relative h-full overflow-hidden">
        <AppShell
          screen={shellScreen}
          onNavigate={handleNavigate}
          hideTabBar={hideTabBar}
        >
          <div className="relative h-full overflow-hidden">
            {/* Home screen — always mounted so scroll position & chip state survive navigation */}
            <div
              className="absolute inset-0 z-0"
              style={showHomeLayer ? undefined : { visibility: "hidden" }}
            >
              <HomeScreen
                onNavigate={handleNavigate}
                onOpenListing={handleOpenListing}
                activeCategory={homeActiveCategory}
                onCategoryChange={setHomeActiveCategory}
                activeSubcategory={homeActiveSubcategory}
                onSubcategoryChange={setHomeActiveSubcategory}
                searchTerm={searchTerm}
                onClearSearch={handleClearSearch}
                resetSignal={homeResetSignal}
                restoreSignal={restoreSignal}
                restoreDataRef={restoreDataRef}
                onScrollToTopRequest={() => setHomeResetSignal((s) => s + 1)}
                initialViewMode={homeViewMode}
                initialSubcategoryDrawerOpen={homeSubcategoryDrawerOpen}
              />
            </div>

            {BaseComponent !== HomeScreen && !isPush && (
              <div className="absolute inset-0 z-0">
                {renderScreen(BaseComponent)}
              </div>
            )}

            {OverlayComponent && (
              <motion.div
                key={`${settled}-${screen}`}
                initial={{ x: isPush ? "100%" : 0 }}
                animate={{ x: isPush ? 0 : "100%" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onAnimationComplete={() => setSettled(screen)}
                className="absolute inset-0 z-10"
                style={isPop ? { pointerEvents: "none" } : undefined}
              >
                {renderScreen(OverlayComponent)}
              </motion.div>
            )}
          </div>
        </AppShell>

        {/* Full-screen modal takeover */}
        <AnimatePresence>
          {isModal && screen === "create-post" && (
            <motion.div
              key="modal-create-post"
              className="absolute inset-0 z-50 flex flex-col bg-cl-surface overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={SPRING_SHEET}
            >
              <CreatePost
                key={createPostKey}
                onNavigate={handleNavigate}
                onDismiss={handleModalDismiss}
              />
            </motion.div>
          )}
          {isModal && screen === "post-detail" && (
            <motion.div
              key="modal-post-detail"
              className="absolute left-0 right-0 bottom-0 z-50 flex flex-col bg-cl-surface overflow-hidden"
              style={
                {
                  top: "calc(var(--chrome-offset) * -1)",
                  "--modal-extends-up": "var(--chrome-offset)",
                } as React.CSSProperties
              }
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={SPRING_SHEET}
            >
              <PostDetail
                onNavigate={handleNavigate}
                onDismiss={handleModalDismiss}
                onReplySubmit={handleReplySubmit}
                variantId={activeVariant}
                variant={activeListing ? listingToDetailVariant(activeListing) : undefined}
                listing={activeListing}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LocationProvider>
  );
}
