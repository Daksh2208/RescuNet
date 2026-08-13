import type { Request, Response } from "express";

interface GoogleGeocodeResponse {
    status: string;
    results: Array<{
        formatted_address: string;
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
        };
    }>;
}

export const geocodeAddress = async (
    req: Request,
    res: Response
) => {
    try {
        const { address } = req.query;

        if (!address || typeof address !== "string") {
            return res.status(400).json({
                success: false,
                message: "Address is required",
            });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: "Google Maps API key is not configured",
            });
        }

        const url =
            `https://maps.googleapis.com/maps/api/geocode/json` +
            `?address=${encodeURIComponent(address)}` +
            `&key=${apiKey}`;

        const response = await fetch(url);

        const data =
            (await response.json()) as GoogleGeocodeResponse;

        if (
            data.status !== "OK" ||
            !data.results ||
            data.results.length === 0
        ) {
            console.log("GOOGLE GEOCODING RESPONSE:", data);

            return res.status(400).json({
                success: false,
                message: "Google geocoding failed",
                googleStatus: data.status,
                // googleError: data.error_message || null,
            });
        }

        const location =
            data.results[0].geometry.location;

        return res.status(200).json({
            success: true,
            data: {
                latitude: location.lat,
                longitude: location.lng,
                formattedAddress:
                    data.results[0].formatted_address,
            },
        });

    } catch (error) {

        console.error("Geocoding error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to find location",
        });

    }
};