"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BellRing,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Trash2,
  X,
} from "lucide-react";

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "deadline" | "application" | "match" | "system";
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Deadline approaching",
    message:
      "Your saved Post-Matric Scholarship application deadline is coming up on 30 Sep.",
    time: "2 hours ago",
    type: "deadline",
    read: false,
  },
  {
    id: 2,
    title: "Application update",
    message:
      "Your Digital India Internship application has moved to the interview stage.",
    time: "Yesterday",
    type: "application",
    read: false,
  },
  {
    id: 3,
    title: "New opportunity match",
    message:
      "We found 4 new opportunities that match your profile and interests.",
    time: "Yesterday",
    type: "match",
    read: true,
  },
  {
    id: 4,
    title: "Profile improvement",
    message:
      "Complete your skills section to improve the relevance of your matches.",
    time: "2 days ago",
    type: "system",
    read: true,
  },
  {
    id: 5,
    title: "Deadline approaching",
    message:
      "The Data Science Fellowship deadline is 10 Sep. Review your application before it closes.",
    time: "3 days ago",
    type: "deadline",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const [filter, setFilter] = useState("All");

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications =
    filter === "Unread"
      ? notifications.filter((notification) => !notification.read)
      : notifications;

  function markAsRead(id: number) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }

  function removeNotification(id: number) {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  }

  function clearAll() {
    setNotifications([]);
  }

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#E8E4ED] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-6 sm:px-8 lg:px-10">

          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#5B4B8A] text-white">
              <span className="text-[15px] font-semibold">A</span>
            </div>

            <span className="text-[19px] font-semibold tracking-[-0.04em]">
              Aptora
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">

            <Link
              href="/dashboard"
              className="text-[12px] text-[#77717F] transition hover:text-[#5B4B8A]"
            >
              Dashboard
            </Link>

            <Link
              href="/opportunities"
              className="text-[12px] text-[#77717F] transition hover:text-[#5B4B8A]"
            >
              Opportunities
            </Link>

            <Link
              href="/saved"
              className="text-[12px] text-[#77717F] transition hover:text-[#5B4B8A]"
            >
              Saved
            </Link>

            <Link
              href="/applications"
              className="text-[12px] text-[#77717F] transition hover:text-[#5B4B8A]"
            >
              Applications
            </Link>

          </nav>

          <div className="flex items-center gap-3">

            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EDF7] text-[#5B4B8A]">
              <Bell size={15} />

              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#5B4B8A] px-1 text-[7px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </div>

            <Link
              href="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5B4B8A] text-[11px] font-semibold text-white"
            >
              A
            </Link>

          </div>

        </div>
      </header>


      {/* CONTENT */}

      <div className="mx-auto max-w-[1050px] px-6 py-10 sm:px-8 lg:py-14">

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[10px] font-medium text-[#8A8490] transition hover:text-[#5B4B8A]"
        >
          <ArrowLeft size={12} />
          Back to dashboard
        </Link>


        {/* TITLE */}

        <section className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#AAA4B1]">
              Updates for you
            </p>

            <div className="mt-3 flex items-center gap-3">

              <h1 className="text-[39px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[50px]">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full bg-[#5B4B8A] px-2.5 py-1 text-[8px] font-semibold text-white">
                  {unreadCount} new
                </span>
              )}

            </div>

            <p className="mt-4 max-w-[540px] text-[11px] leading-6 text-[#817B87]">
              Important updates, deadlines and opportunity matches in
              one place.
            </p>

          </div>


          <div className="flex flex-wrap gap-2">

            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex h-10 items-center gap-2 rounded-full border border-[#DDD8E3] bg-white px-4 text-[9px] font-medium text-[#716A79] transition hover:border-[#C9C0D2] hover:text-[#5B4B8A] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={11} />
              Mark all read
            </button>

            <button
              onClick={clearAll}
              disabled={notifications.length === 0}
              className="flex h-10 items-center gap-2 rounded-full border border-[#DDD8E3] bg-white px-4 text-[9px] font-medium text-[#716A79] transition hover:border-[#C9C0D2] hover:text-[#5B4B8A] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={11} />
              Clear all
            </button>

          </div>

        </section>


        {/* FILTER */}

        <section className="mt-9 flex items-center gap-2">

          {["All", "Unread"].map((item) => (

            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-[9px] font-medium transition ${
                filter === item
                  ? "bg-[#5B4B8A] text-white"
                  : "border border-[#DDD8E3] bg-white text-[#77717F] hover:border-[#C9C0D2] hover:text-[#5B4B8A]"
              }`}
            >
              {item}
            </button>

          ))}

          <span className="ml-1 text-[9px] text-[#AAA4B1]">
            {filteredNotifications.length}{" "}
            {filteredNotifications.length === 1
              ? "notification"
              : "notifications"}
          </span>

        </section>


        {/* NOTIFICATIONS */}

        <section className="mt-6">

          {filteredNotifications.length === 0 ? (

            <div className="rounded-[28px] border border-dashed border-[#DCD6E1] bg-white px-6 py-20 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1EDF7]">
                <BellRing
                  size={21}
                  className="text-[#5B4B8A]"
                />
              </div>

              <h2 className="mt-5 text-[18px] font-semibold">
                You&apos;re all caught up
              </h2>

              <p className="mx-auto mt-2 max-w-[380px] text-[10px] leading-5 text-[#96909A]">
                There are no notifications waiting for you right now.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {filteredNotifications.map((notification) => (

                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onRemove={removeNotification}
                />

              ))}

            </div>

          )}

        </section>


        {/* QUICK LINKS */}

        <section className="mt-8 grid gap-3 sm:grid-cols-3">

          <QuickLink
            href="/saved"
            icon={<Clock3 size={15} />}
            title="Saved deadlines"
            description="Review opportunities before they close."
          />

          <QuickLink
            href="/applications"
            icon={<CheckCircle2 size={15} />}
            title="Application updates"
            description="See where your applications stand."
          />

          <QuickLink
            href="/opportunities"
            icon={<GraduationCap size={15} />}
            title="New matches"
            description="Explore opportunities picked for you."
          />

        </section>

      </div>


      {/* FOOTER */}

      <footer className="border-t border-[#E8E4ED] bg-white">

        <div className="mx-auto flex max-w-[1380px] flex-col gap-3 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#5B4B8A] text-white">
              <span className="text-[12px] font-semibold">
                A
              </span>
            </div>

            <span className="text-[14px] font-semibold">
              Aptora
            </span>

          </div>

          <p className="text-[10px] text-[#AAA4B1]">
            © {new Date().getFullYear()} Aptora
          </p>

          <div className="flex gap-5">

            <Link
              href="/privacy"
              className="text-[10px] text-[#AAA4B1] hover:text-[#5B4B8A]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-[10px] text-[#AAA4B1] hover:text-[#5B4B8A]"
            >
              Terms
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}


/* NOTIFICATION CARD */

function NotificationCard({
  notification,
  onRead,
  onRemove,
}: {
  notification: Notification;
  onRead: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const style = getNotificationStyle(notification.type);

  return (
    <article
      className={`relative rounded-[24px] border p-5 transition sm:p-6 ${
        notification.read
          ? "border-[#E5E0E9] bg-white"
          : "border-[#D8D0E1] bg-[#FDFBFE] shadow-[0_10px_30px_rgba(60,45,80,0.04)]"
      }`}
    >

      {!notification.read && (
        <span className="absolute left-0 top-7 h-7 w-0.5 rounded-r-full bg-[#5B4B8A]" />
      )}

      <div className="flex items-start gap-4">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.background}`}
        >
          {style.icon}
        </div>


        <div className="min-w-0 flex-1">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <h3 className="text-[14px] font-semibold tracking-[-0.02em]">
                  {notification.title}
                </h3>

                {!notification.read && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5B4B8A]" />
                )}

              </div>

              <p className="mt-2 max-w-[650px] text-[10px] leading-5 text-[#89838F]">
                {notification.message}
              </p>

            </div>


            <span className="shrink-0 text-[8px] text-[#AAA4B1]">
              {notification.time}
            </span>

          </div>


          <div className="mt-5 flex flex-wrap items-center gap-2">

            {!notification.read && (
              <button
                onClick={() => onRead(notification.id)}
                className="flex h-8 items-center gap-1.5 rounded-full bg-[#F1EDF7] px-3.5 text-[8px] font-medium text-[#66577F] transition hover:bg-[#EAE4F1]"
              >
                <Check size={10} />
                Mark as read
              </button>
            )}

            <button
              onClick={() => onRemove(notification.id)}
              className="flex h-8 items-center gap-1.5 rounded-full border border-[#E6E1E9] px-3.5 text-[8px] font-medium text-[#A09AA5] transition hover:border-[#D6CEDB] hover:text-[#6B6170]"
            >
              <X size={10} />
              Dismiss
            </button>

          </div>

        </div>

      </div>

    </article>
  );
}


/* QUICK LINK */

function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[22px] border border-[#E5E0E9] bg-white p-5 transition hover:border-[#CEC3D9] hover:shadow-[0_12px_30px_rgba(50,40,70,0.04)]"
    >

      <div className="flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EDF7] text-[#5B4B8A]">
          {icon}
        </div>

        <ArrowRight
          size={12}
          className="text-[#B1AAB6] transition group-hover:translate-x-1 group-hover:text-[#5B4B8A]"
        />

      </div>

      <h3 className="mt-5 text-[12px] font-semibold">
        {title}
      </h3>

      <p className="mt-1.5 text-[9px] leading-5 text-[#96909A]">
        {description}
      </p>

    </Link>
  );
}


/* NOTIFICATION STYLE */

function getNotificationStyle(type: Notification["type"]) {
  switch (type) {
    case "deadline":
      return {
        background: "bg-[#F4F0E9]",
        icon: <CalendarClock size={17} className="text-[#786B51]" />,
      };

    case "application":
      return {
        background: "bg-[#F1EDF7]",
        icon: <CheckCircle2 size={17} className="text-[#5B4B8A]" />,
      };

    case "match":
      return {
        background: "bg-[#F1EDF7]",
        icon: <GraduationCap size={17} className="text-[#66577F]" />,
      };

    default:
      return {
        background: "bg-[#F5F2F6]",
        icon: <Bell size={17} className="text-[#817988]" />,
      };
  }
}