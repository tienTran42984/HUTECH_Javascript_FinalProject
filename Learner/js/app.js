const coursesData = [
    {
        id: 1,
        title: "JavaScript Basics",
        instructor: "John Smith",
        category: "Programming",
        level: "Beginner",
        price: 0,
        image: "../assets/images/js-course.jpg",
        lessons: 8,
        rating: 4.8,
        description: "Learn JavaScript from scratch."
    },
    {
        id: 2,
        title: "UI/UX Design Fundamentals",
        instructor: "Emma Brown",
        category: "Design",
        level: "Intermediate",
        price: 299000,
        image: "../assets/images/uiux-course.jpg",
        lessons: 12,
        rating: 4.7,
        description: "Master the basics of UI/UX design."
    },
    {
        id: 3,
        title: "Digital Marketing 101",
        instructor: "David Lee",
        category: "Marketing",
        level: "Beginner",
        price: 199000,
        image: "../assets/images/marketing-course.jpg",
        lessons: 10,
        rating: 4.6,
        description: "Introduction to digital marketing strategies."
    }
];

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}