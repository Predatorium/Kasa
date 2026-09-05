import { getPropertyByIdAction } from "@/actions/propertiesActions"
import PropertyContent from "./propertyContent";
import { redirect } from "next/navigation";

export default async function Property({ params }) {
    const { id: propertyId } = await params;
    
    let property;
    try {
        const result = await getPropertyByIdAction(propertyId);
        if (!result) throw new Error("");
        property = result;
    } catch (err) {
        if (err.status === 404) {
            redirect('/not-found');
        }
        throw err;
    }

    return <PropertyContent property={property} />;
}