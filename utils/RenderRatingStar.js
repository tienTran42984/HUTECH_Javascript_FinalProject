export function renderStars(avg) {
    const full = Math.floor(avg);
    const half = avg % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return `
        ${'<i class="bi bi-star-fill text-warning"></i>'.repeat(full)}
        ${half ? '<i class="bi bi-star-half text-warning"></i>' : ''}
        ${'<i class="bi bi-star text-warning"></i>'.repeat(empty)}
    `;
}