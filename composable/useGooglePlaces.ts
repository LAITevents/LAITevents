export function useGooglePlaces() {
    const usePlacesApi = (link: any) => {
        return new Promise((resolve, reject) => {
            var googleScript = document.querySelector(
                `script[src="${link}"]`
            ) as HTMLScriptElement;

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
            }
        });
    };

    return { usePlacesApi };
}
