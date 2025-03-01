import Image from "next/image";

const ProfileImage = ({ user }) => {
  const defaultImage =
    "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"; // Replace with a proper default image

  return (
    <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
      <Image
        src={user?.picture || defaultImage}
        alt="Profile Image"
        width={40} // Set a fixed width
        height={40} // Set a fixed height
        className="rounded-full object-cover"
      />
    </div>
  );
};

export default ProfileImage;
