// Preset avatar options
export const AVATARS = [
    { id: 'avatar1', name: 'Professional', path: '/avatars/avatar1.png' },
    { id: 'avatar2', name: 'Creative', path: '/avatars/avatar2.png' },
    { id: 'avatar3', name: 'Nature', path: '/avatars/avatar3.png' },
    { id: 'avatar4', name: 'Tech', path: '/avatars/avatar4.png' },
    { id: 'avatar5', name: 'Elegant', path: '/avatars/avatar5.png' },
    { id: 'avatar6', name: 'Energetic', path: '/avatars/avatar6.png' },
];

export const getAvatarPath = (avatarId) => {
    const avatar = AVATARS.find(a => a.id === avatarId);
    return avatar ? avatar.path : AVATARS[0].path; // Default to avatar1
};
