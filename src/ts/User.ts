export const user: User = {
    score: 0,
};

export function getUserData() {
    const localData = localStorage.getItem("flappy-user");
    if (!localData) return;

    try {
        const parsed = JSON.parse(localData);

        user.score = parsed.score;
    } catch (error) {
        console.error(error);
    }
}

export function saveUserData() {
    localStorage.setItem("flappy-user", JSON.stringify(user));
}
