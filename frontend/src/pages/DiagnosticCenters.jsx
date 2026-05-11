import HealthcareMapPage from "../components/HealthcareMapPage.jsx";

export default function DiagnosticCenters() {
  return (
    <HealthcareMapPage
      type="diagnostic"
      title="Nearby Diagnostic Centers"
      description="Find diagnostic centers in Bangladesh from your MySQL database."
      buttonText="Find Nearby Diagnostic Centers"
      markerColor="#7c3aed"
    />
  );
}