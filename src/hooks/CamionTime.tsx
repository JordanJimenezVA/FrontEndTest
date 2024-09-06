

function useCamionTime() {
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        return `${hours}:${minutes}`;
    };

    return getCurrentTime();
}

export default useCamionTime;