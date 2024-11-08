import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Feather";
import styles from "./HomeScreenStyles";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
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
              name: searchQuery,
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

  const [dateState, setDateState] = useState({
    departureDate: undefined as Date | undefined,
    showDatePicker: false,
  });

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    if (event.type === "set" && selectedDate) {
      if (selectedDateType === "departure") {
        // Add a delay before setting the departure date
        setTimeout(() => {
          setDepartureDate(selectedDate);
        }, 100); // 1000ms delay (1 second)
      } else {
        setTimeout(() => {
          setReturnDate(selectedDate);
        }, 100);
      }
    }

    // Immediately hide the date picker after selecting the date
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

  const handlePress = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.backgroundView} />
      <StatusBar barStyle="default" backgroundColor="#01493E"></StatusBar>
      <View style={styles.card}>
        <View style={styles.shapeContainer}>
          <View style={styles.rectangle}>
            <Text style={styles.bookmarkText}>Easy EMI Plans</Text>
          </View>
          <View style={styles.diamond}></View>
        </View>
        <Text style={styles.cardContent}>
          Get your dream flight with flexible EMI options that suit your budget.
        </Text>
      </View>

      <ScrollView style={styles.bodyCard}>
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
            <Text style={styles.floatingLabel}>Departure Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => openDatePicker("departure")}
            >
              <View>
                <Icon
                  name="calendar"
                  size={15}
                  color="#888"
                  style={{ marginRight: 8 }}
                />
              </View>
              <Text style={styles.dateText}>{formatDate(departureDate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.floatingLabel}>Return Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => openDatePicker("return")}
            >
              <View>
                <Icon
                  name="calendar"
                  size={15}
                  color="#888"
                  style={{ marginRight: 8 }}
                />
              </View>
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
            minimumDate={
              selectedDateType === "departure" ? new Date() : departureDate
            } // Ensure Return Date is after Departure Date
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
            source={require("../../assets/images/Route_icon.png")}
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
              <Text style={styles.passengerLabel}>Travelers</Text>
              <Text style={styles.passengerCount}>
                {adults} Ad, {children} Ch, {infants} In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.classCard}
              onPress={handleClassModalToggle}
            >
              <Text style={styles.classLabel}>Class</Text>
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
                  <Icon
                    name="arrow-left"
                    size={30}
                    color="#000"
                    style={styles.closeArrowImage}
                  />
                </TouchableOpacity>
                <Text style={styles.travelerModalTitle}>Select Travelers</Text>

                {/* Adults Counter */}
                <View style={styles.travelerOptionContainer}>
                  <View>
                    <Text style={styles.travelerOptionText}>Adults</Text>
                    <Text style={styles.ageDescription}>12+ Years</Text>
                  </View>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => handleDecrement("adults")}
                    >
                      <Text style={styles.minusButton}>—</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{adults}</Text>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => handleIncrement("adults")}
                    >
                      <Text style={styles.minusButton}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Children Counter */}
                <View style={styles.travelerOptionContainer}>
                  <View>
                    <Text style={styles.travelerOptionText}>Children</Text>
                    <Text style={styles.ageDescription}>2-12 Years</Text>
                  </View>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => handleDecrement("children")}
                    >
                      <Text style={styles.minusButton}>—</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{children}</Text>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => handleIncrement("children")}
                    >
                      <Text style={styles.minusButton}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Infants Counter */}
                <View style={styles.travelerOptionContainer}>
                  <View>
                    <Text style={styles.travelerOptionText}>Infants</Text>
                    <Text style={styles.ageDescription}>Below 2 Years</Text>
                  </View>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => handleDecrement("infants")}
                    >
                      <Text style={styles.minusButton}>—</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{infants}</Text>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => handleIncrement("infants")}
                    >
                      <Text style={styles.minusButton}>+</Text>
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

export default HomeScreen;
