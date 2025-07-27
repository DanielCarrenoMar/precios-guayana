import { getUserById } from "@/lib/supabase/repository";
import { UUID } from "crypto";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ userId: string }>
}

export default async function UserPage({ params }: Props) {
    const { userId } = await params

    const user = await getUserById(userId as UUID)

    if (!user) {
        notFound();
    }

    return (
        <>
            {userId}
        </>
    )
}