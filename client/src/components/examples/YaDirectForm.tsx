import YaDirectForm from '../YaDirectForm';

export default function YaDirectFormExample() {
  return (
    <div className="max-w-lg">
      <YaDirectForm 
        onSubmit={(data) => console.log('YaDirect form submitted:', data)}
        isLoading={false}
      />
    </div>
  );
}
