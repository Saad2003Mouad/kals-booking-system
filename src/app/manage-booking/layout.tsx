import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Your Booking | Boston Legend",
  description:
    "Access your Boston Legend ice cream truck booking. Enter your booking number and email to securely view and manage your event details.",
};

export default function ManageBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
