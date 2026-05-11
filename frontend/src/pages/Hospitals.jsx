import HealthcareMapPage from "../components/HealthcareMapPage.jsx";

export default function Hospitals() {
  return (
    <HealthcareMapPage
      type="hospital"
      title="Nearby Hospitals"
      description="Find hospitals in Bangladesh from your MySQL database."
      buttonText="Find Nearby Hospitals"
      markerColor="#2563eb"
    />
  );
}