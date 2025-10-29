import type { BloodCompatibility } from "./types"

export const bloodCompatibilityChart: Record<string, BloodCompatibility> = {
  "O+": {
    canDonate: ["O+", "A+", "B+", "AB+"],
    canReceive: ["O+", "O-"],
  },
  "O-": {
    canDonate: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
    canReceive: ["O-"],
  },
  "A+": {
    canDonate: ["A+", "AB+"],
    canReceive: ["O+", "O-", "A+", "A-"],
  },
  "A-": {
    canDonate: ["A+", "A-", "AB+", "AB-"],
    canReceive: ["O-", "A-"],
  },
  "B+": {
    canDonate: ["B+", "AB+"],
    canReceive: ["O+", "O-", "B+", "B-"],
  },
  "B-": {
    canDonate: ["B+", "B-", "AB+", "AB-"],
    canReceive: ["O-", "B-"],
  },
  "AB+": {
    canDonate: ["AB+"],
    canReceive: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
  },
  "AB-": {
    canDonate: ["AB+", "AB-"],
    canReceive: ["O-", "A-", "B-", "AB-"],
  },
}

export function getCompatibleDonors(bloodGroup: string): string[] {
  return bloodCompatibilityChart[bloodGroup]?.canDonate || []
}

export function getCompatibleRecipients(bloodGroup: string): string[] {
  return bloodCompatibilityChart[bloodGroup]?.canReceive || []
}
