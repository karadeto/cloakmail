"use client";

import { Mail } from "@/components/mail";
import { accounts } from "@/models/data";
import { useEmailAliasStore } from "@/store/useEmailAliasStore";
import { useEffect } from "react";

const DashboardPage = () => {
  const { emailAliases, fetchEmailAliases } = useEmailAliasStore();

  useEffect(() => {
    const initializeData = async () => {
      await fetchEmailAliases();
    };
    initializeData();
  }, [fetchEmailAliases]);

  return (
    <div className="h-screen flex">
      <Mail
        accounts={accounts}
        mails={emailAliases}
        defaultLayout={[265, 440, 655]}
        navCollapsedSize={4}
      />
    </div>
  );
};

export default DashboardPage;
