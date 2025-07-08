import TiptapEditor from "@/components/TiptapEditor";

export default function PostPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
        Detail Post
      </h1>
      <p className="text-gray-700">This is the post detail page.</p>
      <TiptapEditor />
    </div>
  );
}