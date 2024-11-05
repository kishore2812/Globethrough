import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

interface Airport {
    id: string; // Using string for IATA code
    name: string; // Using airport name
}

const HomeScreen: React.FC = () => {
    const [airports, setAirports] = useState<Airport[]>([]);
    const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDateType, setSelectedDateType] = useState<'departure' | 'return'>('departure');
    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showAirportModal, setShowAirportModal] = useState(false);
    const [selectedAirportType, setSelectedAirportType] = useState<'from' | 'to'>('from');
    const [fromAirport, setFromAirport] = useState<string>('Select Airport');
    const [toAirport, setToAirport] = useState<string>('Select Airport');
    const [defaultAirportsCount] = useState(10); // Set default number of displayed airports
const [showMoreAirports, setShowMoreAirports] = useState(false); // State to toggle showing more airports
const displayedAirports = showMoreAirports ? filteredAirports : filteredAirports.slice(0, defaultAirportsCount);
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await axios.get(`http://api.aviationstack.com/v1/airports?access_key=9fbdd3b9510e5cde2700232b18652384`);
                // Map the response data to your Airport interface
                const airportsData: Airport[] = response.data.data.map((airport: any) => ({
                    id: airport.iata_code, // Use IATA code as ID
                    name: airport.airport_name // Use airport name
                }));
                setAirports(airportsData);
                setFilteredAirports(airportsData);
            } catch (error) {
                console.error('Error fetching airports:', error);
            }
        };

        fetchAirports();
    }, []);

    // Filter airports based on search query
    useEffect(() => {
        if (searchQuery) {
            const filtered = airports.filter(airport =>
                airport.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredAirports(filtered);
        } else {
            setFilteredAirports(airports);
        }
    }, [searchQuery, airports]);

    const onDateChange = (event: any, selectedDate: Date | undefined) => {
        if (event.type === 'set' && selectedDate) {
            if (selectedDateType === 'departure') {
                setDepartureDate(selectedDate);
            } else {
                setReturnDate(selectedDate);
            }
        }
        setShowDatePicker(false);
    };

    const openDatePicker = (type: 'departure' | 'return') => {
        setSelectedDateType(type);
        setShowDatePicker(true);
    };

    const handleAirportSelect = (airportName: string) => {
        if (selectedAirportType === 'from') {
            setFromAirport(airportName);
        } else {
            setToAirport(airportName);
        }
        setShowAirportModal(false);
        setSearchQuery(''); // Reset search query when an airport is selected
    };

    const formatDate = (date: Date) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <View style={styles.container}>
            {/* Main Card Container for Flight Options */}
            <View style={styles.card}>
                <Image 
                    source={require('../assets/images/Book_mark_image.png')}
                    style={styles.cardImage} 
                    resizeMode="contain" 
                />
                <Text style={styles.cardContent}>
                    Get your dream flight with flexible EMI options that suit your budget.
                </Text>
            </View>

            {/* Body Card for Flight Search */}
            <ScrollView style={styles.bodyCard}>
                <Text style={styles.optionTitle}>Select Trip Type:</Text>
                <View style={styles.tripOptions}>
                    <Pressable
                        style={[styles.tripButton, tripType === 'oneWay' && styles.selectedTripButton]}
                        onPress={() => setTripType('oneWay')}
                    >
                        <Text style={styles.tripButtonText}>One Way</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tripButton, tripType === 'roundTrip' && styles.selectedTripButton]}
                        onPress={() => setTripType('roundTrip')}
                    >
                        <Text style={styles.tripButtonText}>Round Trip</Text>
                    </Pressable>
                </View>

                <View style={styles.dateRow}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.floatingLabel}>Departure Date:</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => openDatePicker('departure')}
                        >
                            <Image source={require('../assets/images/calender_icon.png')} style={styles.icon} />
                            <Text style={styles.dateText}>{formatDate(departureDate)}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dateContainer}>
                        <Text style={styles.floatingLabel}>Return Date:</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => openDatePicker('return')}
                        >
                            <Image source={require('../assets/images/calender_icon.png')} style={styles.icon} />
                            <Text style={styles.dateText}>{formatDate(returnDate)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* DateTimePicker directly in the layout */}
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDateType === 'departure' ? departureDate : returnDate}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                {/* Airport Selection Modal */}
                <Modal
            transparent={true}
            visible={showAirportModal}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Airport</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Airports"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    {displayedAirports.map((airport) => (
                        <TouchableOpacity key={airport.id} style={styles.airportItem} onPress={() => handleAirportSelect(airport.name)}>
                            <Text style={styles.airportText}>{airport.name}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Button to show more airports */}
                    {!showMoreAirports && filteredAirports.length > defaultAirportsCount && (
                        <TouchableOpacity onPress={() => setShowMoreAirports(true)} style={styles.showMoreButton}>
                            <Text style={styles.showMoreText}>Show More</Text>
                        </TouchableOpacity>
                    )}

                    {/* Button to hide the modal */}
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAirportModal(false)}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>


                <View style={styles.locationCards}>
                    <TouchableOpacity
                        style={styles.fromCard}
                        onPress={() => { setSelectedAirportType('from'); setShowAirportModal(true); }}
                    >
                        <Text style={styles.cardTitle}>From</Text>
                        <Text style={styles.cardAirport}>{fromAirport}</Text>
                    </TouchableOpacity>

                    {/* Overlapping Icon */}
                    <Image 
                        source={require('../assets/images/Route_icon.png')} 
                        style={styles.overlapIcon} 
                        resizeMode="contain" 
                    />

                    <TouchableOpacity
                        style={styles.toCard}
                        onPress={() => { setSelectedAirportType('to'); setShowAirportModal(true); }}
                    >
                        <Text style={styles.cardTitle}>To</Text>
                        <Text style={styles.cardAirport}>{toAirport}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

// Styles remain unchanged



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  card: {
    width: '90%',
    height: 80,
    backgroundColor: '#0B3E36',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    marginTop: 20,
    paddingTop: 0,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  cardImage: {
    width: 130,
    height: 24,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cardContent: {
    color: 'white',
    fontSize: 12,
    marginTop: 30,
  },
  bodyCard: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tripOptions: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
    padding: 5,
    alignSelf: 'center',
  },
  tripButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  selectedTripButton: {
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
  },
  tripButtonText: {
    fontSize: 14,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flex: 1,
    marginRight: 10,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    top: -8,
    left: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 5,
    fontSize: 14,
    color: '#888',
    zIndex: 1,
  },
  dateInput: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateText: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#000',
  },


  locationCards: {
    width: '100%', // Ensure it takes the full width
    marginBottom: 20,
    marginTop:20
  },
  fromCard: {
    width: '100%', // Take the entire width of the row
    backgroundColor: '#F3F5FA',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10, // Space between cards
    justifyContent: 'flex-start', // Align text to the left
    alignItems: 'flex-start', // Align text to the left
  },
  toCard: {
    width: '100%', // Take the entire width of the row
    backgroundColor: '#F3F5FA',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10, // Space between cards
    justifyContent: 'flex-start', // Align text to the left
    alignItems: 'flex-start', // Align text to the left
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardAirport: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  overlapIcon: {
    position: 'absolute',
    top: '50%', // Adjust the position as necessary
    left: '50%', // Center horizontally
    transform: [{ translateX: -25 }, { translateY: -25 }], // Adjust size and positioning
    width: 40, // Adjust the size as needed
    height: 40, // Adjust the size as needed
    zIndex: 1, // Ensure the icon is on top of the cards
  },
  
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  showMoreButton: {
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
},
showMoreText: {
    fontSize: 16,
    color: '#007BFF',
},
});

export default HomeScreen;
