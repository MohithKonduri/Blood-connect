import { auth, db } from "./firebase"
import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp, setDoc, getDoc } from "firebase/firestore"
import type { Donor, EmergencyRequest } from "./types"

// Donor operations
export async function addDonor(donorData: Omit<Donor, "id" | "createdAt" | "updatedAt">) {
  try {
    if (!db) {
      throw new Error("Firebase not initialized")
    }
    const currentUser = auth?.currentUser

    // If the user is authenticated, store the donor doc using their UID as the document ID
    if (currentUser?.uid) {
      const donorRef = doc(db, "donors", currentUser.uid)
      await setDoc(
        donorRef,
        {
          ...donorData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        { merge: true },
      )
      return donorRef.id
    }

    // Fallback: create a random-id document if auth user is not available (should be rare)
    const randomRef = await addDoc(collection(db, "donors"), {
      ...donorData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return randomRef.id
  } catch (error) {
    console.error("Error adding donor:", error)
    if (error instanceof Error && error.message.includes("permissions")) {
      throw new Error("Firebase permissions error. Please check Firestore security rules.")
    }
    throw error
  }
}

export async function getDonorsByBloodGroup(bloodGroup: string) {
  try {
    const q = query(collection(db, "donors"), where("bloodGroup", "==", bloodGroup), where("isAvailable", "==", true))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Donor)
  } catch (error) {
    console.error("Error fetching donors:", error)
    throw error
  }
}

export async function getDonorsByDistrict(district: string) {
  try {
    const q = query(collection(db, "donors"), where("district", "==", district), where("isAvailable", "==", true))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Donor)
  } catch (error) {
    console.error("Error fetching donors by district:", error)
    throw error
  }
}

export async function updateDonorAvailability(donorId: string, isAvailable: boolean) {
  try {
    const donorRef = doc(db, "donors", donorId)
    await updateDoc(donorRef, {
      isAvailable,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating donor availability:", error)
    throw error
  }
}

export async function searchDonors(bloodGroup?: string, district?: string) {
  try {
    let q = query(collection(db, "donors"), where("isAvailable", "==", true))

    if (bloodGroup && district) {
      q = query(
        collection(db, "donors"),
        where("isAvailable", "==", true),
        where("bloodGroup", "==", bloodGroup),
        where("district", "==", district),
      )
    } else if (bloodGroup) {
      q = query(collection(db, "donors"), where("isAvailable", "==", true), where("bloodGroup", "==", bloodGroup))
    } else if (district) {
      q = query(collection(db, "donors"), where("isAvailable", "==", true), where("district", "==", district))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Donor)
  } catch (error) {
    console.error("Error searching donors:", error)
    throw error
  }
}

// Emergency request operations
export async function createEmergencyRequest(requestData: Omit<EmergencyRequest, "id" | "createdAt">) {
  try {
    const docRef = await addDoc(collection(db, "emergencyRequests"), {
      ...requestData,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating emergency request:", error)
    throw error
  }
}

export async function getEmergencyRequests(status = "open") {
  try {
    const q = query(collection(db, "emergencyRequests"), where("status", "==", status))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as EmergencyRequest)
  } catch (error) {
    console.error("Error fetching emergency requests:", error)
    throw error
  }
}
