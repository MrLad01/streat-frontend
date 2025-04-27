"use server";
import { prisma } from "@/libs/prismaDb";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/libs/isAuthorized";
import { user } from "@/types"; // Import the User type

export async function getApiKeys() {
  const user = await isAuthorized();
  if (!user) {
    return []; // If the user is not authorized, return an empty array
  }

  const res = await prisma.apiKey.findMany({
    where: {
      userId: user.id, // Access the id property directly
    },
  });
  return res;
}

export async function createApiKey(keyName: string) {
  const user = await isAuthorized();

  if (!user) {
    return null; // Return null if the user is not authorized
  }

  const key = user.role; // Use the user's role for the API key

  // Hash the key
  const hashedKey = await bcrypt.hash(key, 10);

  await prisma.apiKey.create({
    data: {
      name: keyName,
      key: hashedKey,
      userId: user.id, // Store the user's id
    },
  });

  revalidatePath("/admin/api");
}

export async function deleteApiKey(id: string) {
  const res = await prisma.apiKey.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/api");
  return res;
}
