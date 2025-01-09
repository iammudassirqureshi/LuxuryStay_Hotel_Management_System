export const parsedUser = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role || "guest",
    picture: user.picture,
    address: user.address,
    dob: user.dob,
    isActive: user.isActive,
    preferences: user.preferences,
  };
};

export const parsedRoom = (room) => {
  if (!room) return null;

  return {
    id: room._id,
    roomNumber: room.roomNumber,
    type: room.type,
    size: room.size,
    bedSize: room.bedSize,
    view: room.view,
    price: room.price,
    status: room.status,
    amenities: room.amenities,
    thumbnail: room.thumbnail,
    pictures: room.pictures,
    maxGuests: room.maxGuests,
    tax: room.tax,
  };
};

export const parsedRooms = (rooms) => {
  if (!rooms) return [];

  return rooms.map((room) => {
    return {
      id: room._id || "",
      roomNumber: room.roomNumber || 0,
      type: room.type || "",
      size: room.size || 0,
      bedSize: room.bedSize || 0,
      view: room.view || "",
      price: room.price || 0,
      status: room.status || "",
      amenities: room.amenities || [],
      thumbnail: room.thumbnail || "",
      pictures: room.pictures || [],
      maxGuests: room.maxGuests || 0,
      tax: room.tax || 0,
    };
  });
};
