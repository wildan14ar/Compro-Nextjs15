export default function ButtonUser() {

  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={() => {
        // Handle user button click
        console.log("User button clicked");
      }}
    >
      <span className="text-sm">User</span>
    </button>
  );
}