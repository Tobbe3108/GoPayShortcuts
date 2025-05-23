import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    // Return the fetch function so it can be used in the component
    return {
        fetch
    };
};
