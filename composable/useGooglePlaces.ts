export function useGooglePlaces() {
    const usePlacesApi = (link: any) => {
        return new Promise((resolve, reject) => {
            let id = "__googleMapsScriptId";
            var googleScript = document.getElementById(id) as HTMLScriptElement;

            // Check if google script already exist
            if (!googleScript) {
                googleScript = document.createElement("script");
                googleScript.setAttribute("id", "__googleMapsScriptId");
                googleScript.src = link;
                googleScript.async = true;
                document.head.append(googleScript);

                googleScript.addEventListener("error", () => {
                    reject();
                });

                googleScript.addEventListener("load", () => {
                    resolve(googleScript);
                });
            } else {
                resolve(googleScript);
            }
        });
    };

    return { usePlacesApi };
}
