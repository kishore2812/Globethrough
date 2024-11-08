import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { RadioButton } from "react-native-paper";

interface Airport {
  icao: string;
  iata: string;
  name: string;
  city: string;
  region: string;
  country: string;
}

const HomeScreen: React.FC = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateType, setSelectedDateType] = useState<
    "departure" | "return"
  >("departure");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("oneWay");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAirportModal, setShowAirportModal] = useState(false);
  const [selectedAirportType, setSelectedAirportType] = useState<"from" | "to">(
    "from"
  );
  const [fromAirport, setFromAirport] = useState<string>("Select Airport");
  const [toAirport, setToAirport] = useState<string>("Select Airport");
  const [defaultAirportsCount] = useState(10);
  const [showMoreAirports, setShowMoreAirports] = useState(false);
  const displayedAirports = showMoreAirports
    ? filteredAirports
    : filteredAirports.slice(0, defaultAirportsCount);

  const [isTravelerModalVisible, setTravelerModalVisible] = useState(false);
  const [isClassModalVisible, setClassModalVisible] = useState(false);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedClass, setSelectedClass] = useState("");

  const handleTravelerModalToggle = () => {
    setTravelerModalVisible(!isTravelerModalVisible);
  };

  const handleClassModalToggle = () => {
    setClassModalVisible(!isClassModalVisible);
  };

  const handleIncrement = (type: "adults" | "children" | "infants") => {
    if (type === "adults") setAdults(adults + 1);
    else if (type === "children") setChildren(children + 1);
    else if (type === "infants") setInfants(infants + 1);
  };

  const handleDecrement = (type: "adults" | "children" | "infants") => {
    if (type === "adults" && adults > 0) setAdults(adults - 1);
    else if (type === "children" && children > 0) setChildren(children - 1);
    else if (type === "infants" && infants > 0) setInfants(infants - 1);
  };

  // Fetch airports based on search query
  useEffect(() => {
    const fetchAirports = async () => {
      if (searchQuery.trim() === "") {
        setAirports([]); // Clear airports if search query is empty
        return;
      }
      try {
        const response = await axios.get(
          `https://api.api-ninjas.com/v1/airports`,
          {
            headers: {
              "X-Api-Key": "XjPaLWWYKP+hhHIXefZCbA==PuizAevleYj75RH3",
            },
            params: {
              name: searchQuery, // Pass the search query
            },
          }
        );

        setAirports(response.data); // Set airports to the state
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error fetching airports:",
            error.response?.status,
            error.message
          );
        } else {
          console.error("Request failed:", error);
        }
      }
    };

    fetchAirports();
  }, [searchQuery]); // Dependency array includes searchQuery

  // Filter the displayed airports based on the search query
  useEffect(() => {
    const filtered = airports.filter(
      (airport) =>
        airport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airport.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airport.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airport.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAirports(filtered);
  }, [searchQuery, airports]);

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    if (event.type === "set" && selectedDate) {
      if (selectedDateType === "departure") {
        setDepartureDate(selectedDate);
      } else {
        setReturnDate(selectedDate);
      }
    }
    setShowDatePicker(false);
  };

  const openDatePicker = (type: "departure" | "return") => {
    setSelectedDateType(type);
    setShowDatePicker(true);
  };

  const handleAirportSelect = (airportName: string) => {
    if (selectedAirportType === "from") {
      setFromAirport(airportName);
    } else {
      setToAirport(airportName);
    }
    setShowAirportModal(false);
    setSearchQuery(""); // Clear search query after selection
  };

  const formatDate = (date: Date) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleClassSelection = (cls: string) => {
    setSelectedClass(cls); // Set the selected class
    setClassModalVisible(false); // Close the modal after selection
  };

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Function to handle button press and set selected option
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handlePress = () => {
    // Do nothing for now
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundView} />
      <View style={styles.card}>
        <Image
          source={require("../assets/images/Book_mark_image.png")}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <Text style={styles.cardContent}>
          Get your dream flight with flexible EMI options that suit your budget.
        </Text>
      </View>

      <ScrollView style={styles.bodyCard}>
        <Text style={styles.optionTitle}>Select Trip Type:</Text>
        <View style={styles.tripOptions}>
          <Pressable
            style={[
              styles.tripButton,
              tripType === "oneWay" && styles.selectedTripButton,
            ]}
            onPress={() => setTripType("oneWay")}
          >
            <Text style={styles.tripButtonText}>One Way</Text>
          </Pressable>
          <Pressable
            style={[
              styles.tripButton,
              tripType === "roundTrip" && styles.selectedTripButton,
            ]}
            onPress={() => setTripType("roundTrip")}
          >
            <Text style={styles.tripButtonText}>Round Trip</Text>
          </Pressable>
        </View>

        <View style={styles.dateRow}>
          <View style={styles.dateContainer}>
            <Text style={styles.floatingLabel}>Departure Date:</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => openDatePicker("departure")}
            >
              <Image
                source={require("../assets/images/calender_icon.png")}
                style={styles.icon}
              />
              <Text style={styles.dateText}>{formatDate(departureDate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.floatingLabel}>Return Date:</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => openDatePicker("return")}
            >
              <Image
                source={require("../assets/images/calender_icon.png")}
                style={styles.icon}
              />
              <Text style={styles.dateText}>{formatDate(returnDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={
              selectedDateType === "departure" ? departureDate : returnDate
            }
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Modal
          transparent={true}
          visible={showAirportModal}
          animationType="slide"
        >
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Airport</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Airports"
                value={searchQuery}
                onChangeText={setSearchQuery} // Update search query
              />

              <ScrollView style={styles.airportList}>
                {displayedAirports.length > 0 ? (
                  displayedAirports.map((airport, index) => (
                    <TouchableOpacity
                      key={`${airport.iata}-${airport.city}-${airport.country}-${index}`} // Add index for uniqueness
                      style={styles.airportItem}
                      onPress={() => handleAirportSelect(airport.name)}
                    >
                      <Text style={styles.airportText}>
                        {airport.name} ({airport.city}, {airport.country})
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noResultsText}>No airports found</Text>
                )}
              </ScrollView>

              {!showMoreAirports &&
                filteredAirports.length > defaultAirportsCount && (
                  <TouchableOpacity
                    onPress={() => setShowMoreAirports(true)}
                    style={styles.showMoreButton}
                  >
                    <Text style={styles.showMoreText}>Show More</Text>
                  </TouchableOpacity>
                )}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAirportModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <View style={styles.locationCards}>
          <TouchableOpacity
            style={styles.fromCard}
            onPress={() => {
              setSelectedAirportType("from");
              setShowAirportModal(true);
            }}
          >
            <Text style={styles.cardTitle}>From</Text>
            <Text style={styles.cardAirport}>{fromAirport}</Text>
          </TouchableOpacity>

          <Image
            source={require("../assets/images/Route_icon.png")}
            style={styles.overlapIcon}
          />

          <TouchableOpacity
            style={styles.toCard}
            onPress={() => {
              setSelectedAirportType("to");
              setShowAirportModal(true);
            }}
          >
            <Text style={styles.cardTitle}>To</Text>
            <Text style={styles.cardAirport}>{toAirport}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.passengerClassContainer}>
          <View style={styles.passengerRow}>
            <TouchableOpacity
              style={styles.passengerCard}
              onPress={handleTravelerModalToggle}
            >
              <Text style={styles.passengerLabel}>Travellers:</Text>
              <Text style={styles.passengerCount}>
                {adults} Ad, {children} Ch, {infants} In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.classCard}
              onPress={handleClassModalToggle}
            >
              <Text style={styles.classLabel}>Class:</Text>
              <Text style={styles.classSelection}>
                {selectedClass || "Select Class"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Traveler Modal */}

          {/* Traveler Modal */}
          <Modal
            visible={isTravelerModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.travelerModalContainer}>
                {/* Close Arrow at the Top */}
                <TouchableOpacity
                  style={styles.closeArrowContainer}
                  onPress={handleTravelerModalToggle}
                >
                  <Image
                    source={require("../assets/images/back_arrow_icon.png")}
                    style={styles.closeArrowImage}
                  />
                </TouchableOpacity>
                <Text style={styles.travelerModalTitle}>Select Travelers</Text>

                {/* Adults Counter */}
                <View style={styles.travelerOptionContainer}>
                  <View>
                    <Text style={styles.travelerOptionText}>Adults</Text>
                    <Text style={styles.ageDescription}>(Age 12+)</Text>
                  </View>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity onPress={() => handleDecrement("adults")}>
                      <Image
                        source={require("../assets/images/minus_icon.png")}
                        style={styles.counterButtonImage}
                      />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{adults}</Text>
                    <TouchableOpacity onPress={() => handleIncrement("adults")}>
                      <Image
                        source={require("../assets/images/Plus_icon.png")}
                        style={styles.counterButtonImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Children Counter */}
                <View style={styles.travelerOptionContainer}>
                  <View>
                    <Text style={styles.travelerOptionText}>Children</Text>
                    <Text style={styles.ageDescription}>(Ages 2-11)</Text>
                  </View>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity
                      onPress={() => handleDecrement("children")}
                    >
                      <Image
                        source={require("../assets/images/minus_icon.png")}
                        style={styles.counterButtonImage}
                      />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{children}</Text>
                    <TouchableOpacity
                      onPress={() => handleIncrement("children")}
                    >
                      <Image
                        source={require("../assets/images/Plus_icon.png")}
                        style={styles.counterButtonImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Infants Counter */}
                <View style={styles.travelerOptionContainer}>
                  <View>
                    <Text style={styles.travelerOptionText}>Infants</Text>
                    <Text style={styles.ageDescription}>(Under 2 years)</Text>
                  </View>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity
                      onPress={() => handleDecrement("infants")}
                    >
                      <Image
                        source={require("../assets/images/minus_icon.png")}
                        style={styles.counterButtonImage}
                      />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{infants}</Text>
                    <TouchableOpacity
                      onPress={() => handleIncrement("infants")}
                    >
                      <Image
                        source={require("../assets/images/Plus_icon.png")}
                        style={styles.counterButtonImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleTravelerModalToggle}
                >
                  <Text style={styles.closeButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Class Modal */}
          <Modal
            visible={isClassModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClassModalToggle} // Close modal on Android back press
          >
            <View style={styles.modalOverlay1}>
              <View style={styles.modalContent1}>
                <Text style={styles.modalTitle1}>Select Class</Text>
                {["Economy", "Business", "First"].map((cls) => (
                  <TouchableOpacity
                    key={cls}
                    onPress={() => handleClassSelection(cls)} // Set class when an option is selected
                    style={styles.modalOption1}
                  >
                    {/* RadioButton for each class */}
                    <RadioButton
                      value={cls}
                      status={selectedClass === cls ? "checked" : "unchecked"} // Check if this option is selected
                      onPress={() => handleClassSelection(cls)}
                      color="#0B3E36" // Handle radio button press
                    />
                    <Text style={styles.classOption1}>{cls}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.container1}>
          {/* Heading */}
          <Text style={styles.heading}>Special Fare Options</Text>

          {/* Fare Option Buttons / Cards */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedOption === "Option 1" && styles.selectedOption,
              ]}
              onPress={() => handleOptionSelect("Option 1")}
            >
              <Text style={styles.optionText}>Student</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedOption === "Option 2" && styles.selectedOption,
              ]}
              onPress={() => handleOptionSelect("Option 2")}
            >
              <Text style={styles.optionText}>Senior Citizen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedOption === "Option 3" && styles.selectedOption,
              ]}
              onPress={() => handleOptionSelect("Option 3")}
            >
              <Text style={styles.optionText}>Armed Force</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Search Flights</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backgroundView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "60%", // Take 60% of the height
    backgroundColor: "#01493E", // Solid background color (you can change this)
    zIndex: -10, // Ensure it appears behind the content
    borderBottomLeftRadius: 20, // Curve at the bottom-left
    borderBottomRightRadius: 20, // Curve at the bottom-right
  },
  card: {
    width: "90%",
    height: 80,
    backgroundColor: "#0B3E36",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
    marginTop: 5,
    paddingTop: 0,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  cardImage: {
    width: 130,
    height: 24,
    position: "absolute",
    top: 0,
    left: 0,
  },
  cardContent: {
    color: "white",
    fontSize: 12,
    marginTop: 30,
  },
  bodyCard: {
    width: "95%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tripOptions: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
    padding: 5,
    alignSelf: "center",
  },
  tripButton: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
  selectedTripButton: {
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
  },
  tripButtonText: {
    fontSize: 14,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateContainer: {
    flex: 1,
    marginRight: 10,
    position: "relative",
  },
  floatingLabel: {
    position: "absolute",
    top: -8,
    left: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 5,
    fontSize: 14,
    color: "#888",
    zIndex: 1,
  },
  dateInput: {
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  dateText: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingLeft: 5,
    fontSize: 14,
  },
  icon: {
    width: 18,
    height: 20,
    marginRight: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  airportList: {
    maxHeight: "60%", // Limit height of the airport list
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  airportItem: {
    paddingVertical: 10,
  },
  airportText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 20,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#000",
  },

  locationCards: {
    width: "100%", // Ensure it takes the full width
    marginBottom: 3,
    marginTop: 15,
  },
  fromCard: {
    width: "100%", // Take the entire width of the row
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    padding: 15,
    marginBottom: 10, // Space between cards
    justifyContent: "flex-start", // Align text to the left
    alignItems: "flex-start", // Align text to the left
  },
  toCard: {
    width: "100%", // Take the entire width of the row
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    padding: 15,
    marginBottom: 10, // Space between cards
    justifyContent: "flex-start", // Align text to the left
    alignItems: "flex-start", // Align text to the left
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardAirport: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
  },
  overlapIcon: {
    position: "absolute",
    top: "50%", // Adjust the position as necessary
    left: "50%", // Center horizontally
    transform: [{ translateX: -25 }, { translateY: -25 }], // Adjust size and positioning
    width: 40, // Adjust the size as needed
    height: 40, // Adjust the size as needed
    zIndex: 1, // Ensure the icon is on top of the cards
  },

  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  showMoreButton: {
    marginTop: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  showMoreText: {
    fontSize: 16,
    color: "#007BFF",
  },
  noResultsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },

  passengerClassContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  passengerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  passengerCard: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#888",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  passengerCount: {
    fontSize: 14,
    color: "#444",
    fontWeight: "bold",
  },
  passengerLabel: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 5,
    fontSize: 14,
    color: "#888",
    zIndex: 1,
  },
  classCard: {
    borderWidth: 1,
    borderColor: "#888",
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  classSelection: {
    fontSize: 14,
    color: "#444",
    fontWeight: "bold",
  },
  classLabel: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 5,
    fontSize: 14,
    color: "#888",
    zIndex: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center", // Position the modal at the bottom
  },
  travelerModalContainer: {
    top: 100,
    width: "95%", // Full width
    height: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    position: "absolute", // Make the modal position absolute
    // Align to the bottom
  },
  travelerModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "left",
    color: "#333",
  },
  ageDescription: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  travelerOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 15,
  },
  travelerOptionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },

  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  counterButtonImage: {
    width: 18, // Adjust width to fit your icon size
    height: 18, // Adjust height to fit your icon size
    resizeMode: "contain", // Keep the aspect ratio of the image
  },
  counterValue: {
    fontWeight: "bold",
    fontSize: 18, // Font size for the counter value
    marginHorizontal: 20, // Space between the button and the value
  },

  closeArrowContainer: {
    zIndex: 1,

    marginBottom: 30,
  },

  closeArrowImage: {
    width: 21, // Width for the arrow image
    height: 18, // Height for the arrow image
  },

  closeButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    borderRadius: 5,
  },
  closeButton: {
    padding: 20,
    backgroundColor: "#01493E",
    borderRadius: 5,
    marginTop: 120,
    marginBottom: 60,
  },

  modalOverlay1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark background
  },
  modalContent1: {
    width: 250,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "flex-start", // Align radio buttons and text to the left
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle1: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalOption1: {
    flexDirection: "row", // Align radio button and text horizontally
    alignItems: "center", // Align items in the center vertically
    width: "100%",
    marginBottom: 15, // Add space between options
  },
  classOption1: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10, // Space between the radio button and the text
  },

  container1: {
    flex: 1,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "left", // Ensures the heading is aligned to the left
  },
  optionsContainer: {
    flexDirection: "row", // Places the options horizontally
    justifyContent: "space-between",
  },
  optionCard: {
    flex: 1, // Each option card takes equal width
    borderWidth: 1,
    borderColor: "#888",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    marginHorizontal: 5,
    paddingVertical: 12, // Adds spacing between each card
  },
  optionText: {
    fontSize: 12,
  },
  selectedOption: {
    backgroundColor: "#f2f2f2", // Grey background for the selected option
  },
  button: {
    marginTop: 15,
    backgroundColor: "#01493E", // A blue color for the button background
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // White text color
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
