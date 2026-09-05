'use client'

import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";

export default function MessageLayout() {
    const { user } = useAuth();

    if (!user) {
        redirect("/login");
    }
}