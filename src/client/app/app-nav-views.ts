export const views: NavViews[] = [
    {
        name: 'Chat',
        icon: 'chat',
        link: ['chat'],
    },
    {
        name: 'Blog',
        icon: 'trending_up',
        link: ['blog'],
    },
];

interface NavViews {
    name: string;
    icon: string;
    link: string[];
}
