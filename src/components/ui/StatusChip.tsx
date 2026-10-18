import React from "react";
import type { ProjectStatus } from "@/content/projects";

interface StatusChipProps {
  status: ProjectStatus | "self-reported" | "verified";
  className?: string;
}

export function StatusChip({ status, className = "" }: StatusChipProps) {
  const getLabel = () => {
    switch (status) {
      case "documented":
        return "Architecture Documented";
      case "in-progress":
        return "In Progress";
      case "planned":
        return "Planned Spec";
      case "to-confirm":
        return "Prototype / Status to Confirm";
      case "self-reported":
        return "Self-Reported Placement";
      case "verified":
        return "Certificate Verified";
      default:
        return status;
    }
  };

  const getModifier = () => {
    switch (status) {
      case "documented":
        return "status-chip--documented";
      case "in-progress":
        return "status-chip--in-progress";
      case "planned":
      case "to-confirm":
        return "status-chip--to-confirm";
      case "self-reported":
        return "status-chip--self-reported";
      default:
        return "";
    }
  };

  return (
    <span className={`status-chip ${getModifier()} ${className}`}>
      {getLabel()}
    </span>
  );
}
