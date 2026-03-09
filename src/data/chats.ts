import { useSyncExternalStore } from "react";

export interface ChatMessage {
  id: string;
  fromUser: boolean;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  posterName: string;
  posterInitial: string;
  listingTitle: string;
  listingCategory: string;
  listingSubcategory: string;
  lastMessage: string;
  timestamp: string;
  messages: ChatMessage[];
  unread: boolean;
}

let threads: ChatThread[] = [
  {
    id: "thread-dresser",
    posterName: "mid-century modern dresser",
    posterInitial: "M",
    listingTitle: "mid-century modern dresser",
    listingCategory: "for sale",
    listingSubcategory: "furniture",
    lastMessage: "yes! it's still available. want to come see it this weekend?",
    timestamp: "2m ago",
    unread: true,
    messages: [
      {
        id: "msg-1",
        fromUser: true,
        text: "hi, i'm interested in your post!",
        timestamp: "12:34 pm",
      },
      {
        id: "msg-2",
        fromUser: false,
        text: "yes! it's still available. want to come see it this weekend?",
        timestamp: "12:41 pm",
      },
    ],
  },
  {
    id: "thread-apartment",
    posterName: "2br uptown apartment",
    posterInitial: "2",
    listingTitle: "2br uptown apartment",
    listingCategory: "housing",
    listingSubcategory: "apartments / housing for rent",
    lastMessage: "the unit is available for a showing thursday after 5pm",
    timestamp: "1h ago",
    unread: false,
    messages: [
      {
        id: "msg-3",
        fromUser: true,
        text: "hi, i'm interested in your post!",
        timestamp: "10:15 am",
      },
      {
        id: "msg-4",
        fromUser: false,
        text: "hi! yes it is. are you looking to move in april?",
        timestamp: "10:22 am",
      },
      {
        id: "msg-5",
        fromUser: true,
        text: "yes, ideally early april. could i schedule a showing?",
        timestamp: "10:25 am",
      },
      {
        id: "msg-6",
        fromUser: false,
        text: "the unit is available for a showing thursday after 5pm",
        timestamp: "10:31 am",
      },
    ],
  },
  {
    id: "thread-phone",
    posterName: "iphone 14 pro - refurbished",
    posterInitial: "I",
    listingTitle: "iphone 14 pro - refurbished",
    listingCategory: "for sale",
    listingSubcategory: "cell phones",
    lastMessage: "sounds good, i'll hold it for you until tomorrow",
    timestamp: "3h ago",
    unread: false,
    messages: [
      {
        id: "msg-7",
        fromUser: true,
        text: "what condition is the battery in?",
        timestamp: "9:02 am",
      },
      {
        id: "msg-8",
        fromUser: false,
        text: "battery health is at 94%. replaced the screen, everything else is original",
        timestamp: "9:10 am",
      },
      {
        id: "msg-9",
        fromUser: true,
        text: "great, i'd like to buy it. can i pick it up today?",
        timestamp: "9:12 am",
      },
      {
        id: "msg-10",
        fromUser: false,
        text: "sounds good, i'll hold it for you until tomorrow",
        timestamp: "9:15 am",
      },
    ],
  },
];

const listeners = new Set<() => void>();
function emit() { for (const l of listeners) l(); }
function getSnapshot() { return threads; }
function subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); }

export function useChatThreads(): ChatThread[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

let nextMsgId = 100;

export function addChatThread(thread: ChatThread) {
  threads = [thread, ...threads];
  emit();
}

export function addMessageToThread(threadId: string, text: string) {
  threads = threads.map((t) =>
    t.id === threadId
      ? {
          ...t,
          lastMessage: text,
          timestamp: "just now",
          messages: [
            ...t.messages,
            { id: `msg-${++nextMsgId}`, fromUser: true, text, timestamp: "just now" },
          ],
        }
      : t,
  );
  emit();
}
