import { View, Text } from "react-native"

// Remove memo - let React handle updates naturally
const BusCallout = ({ selectedBus }) => {
  if (!selectedBus) return null

  // Handle both status_detail (singular) and status_details (plural) from MongoDB
  const statusDetail = selectedBus.status_detail || selectedBus.status_details

  // Determine status color
  const getStatusColor = () => {
    if (selectedBus.status === "available") return "#4CAF50"
    if (selectedBus.status === "full") return "#F44336"
    return "#FFC107"
  }

  // Determine status details color
  const getStatusDetailsColor = () => {
    if (statusDetail === "standing" || statusDetail === "standby") {
      return "#FF9800" // Orange for standing/standby
    }
    if (statusDetail === "full") {
      return "#F44336" // Red for full
    }
    if (selectedBus.status === "available") return "#4CAF50"
    if (selectedBus.status === "full") return "#F44336"
    return "#FFC107"
  }

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        width: 260,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "700", fontSize: 16, color: "#222" }}>{selectedBus.route || "Bus"}</Text>

        <View
          style={{
            backgroundColor: getStatusColor(),
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "#fff",
              fontWeight: "600",
            }}
          >
            {selectedBus.status?.toUpperCase() || "UNKNOWN"}
          </Text>
        </View>
      </View>

      {/* Bound For */}
      <View style={{ marginBottom: 6 }}>
        <Text style={{ fontSize: 13, color: "#555" }}>
          <Text style={{ fontWeight: "600", color: "#333" }}>Bound For:</Text>{" "}
          {selectedBus.bound_for || "Not available"}
        </Text>
      </View>

      {/* Status Details with color indicator */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
        <Text style={{ fontSize: 13, color: "#555" }}>
          <Text style={{ fontWeight: "600", color: "#333" }}>Details:</Text>{" "}
        </Text>
        <View
          style={{
            backgroundColor: getStatusDetailsColor(),
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 6,
            marginLeft: 4,
          }}
        >
          <Text style={{ fontSize: 12, color: "#fff", fontWeight: "600" }}>{statusDetail?.toUpperCase() || "N/A"}</Text>
        </View>
      </View>

      {/* Available Seats */}
      <View>
        <Text style={{ fontSize: 13, color: "#555" }}>
          <Text style={{ fontWeight: "600", color: "#333" }}>Available Seats:</Text>{" "}
          {selectedBus.available_seats ?? "N/A"}
        </Text>
      </View>
    </View>
  )
}

BusCallout.displayName = "BusCallout"

export default BusCallout
