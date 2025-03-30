package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.entity.request.BookingRequest;
import com.example.demo.enums.BookingEnum;
import com.example.demo.enums.RoleEnum;
import com.example.demo.enums.SlotStatus;
import com.example.demo.exception.exceptions.BookingException;
import com.example.demo.exception.exceptions.NotFoundException;
import com.example.demo.repository.*;
import com.example.demo.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    SlotRepository slotRepository;

    @Autowired
    UserRepository expertRepository;

    @Autowired
    SlotExpertRepository slotExpertRepository;

    @Autowired
    ServiceRepository serviceRepository;

    @Autowired
    UserUtils userUtils;

    public void calculateAndSaveExpertPayment(Booking booking) {
        SlotExpert slotExpert = booking.getSlotExpert();
        User expert = slotExpert.getExpert();

        if (expert == null) {
            throw new NotFoundException("Expert not found for this booking");
        }

        // Calculate total service price
        double totalServicePrice = booking.getServices().stream()
                .mapToDouble(ServicePackage::getPrice)
                .sum();

        // Calculate expert's payment based on their rate
        double expertRate = expert.getRate();
        double expertPayment = totalServicePrice * expertRate ;

        // Update expert’s total earnings
        expert.setTotalEarnings(expert.getTotalEarnings() + expertPayment);

        // Save updated expert earnings
        expertRepository.save(expert);

        // Save calculated payment in booking for reference
        booking.setExpertPayment(expertPayment);
        bookingRepository.save(booking);
    }

    public Booking createBooking(BookingRequest bookingRequest)  {
        User expert = null;
        Slot slot = slotRepository.findById(bookingRequest.getSlotId()).orElseThrow(() -> new NotFoundException("Slot not found"));
        //code here

        if (bookingRequest.getBookingDate().isBefore(LocalDate.now())) {
            throw new BookingException("Booking date cannot be in the past");
        }


        //ng quen booking nen chon luon staff
        if (bookingRequest.getExpertId() != null){
            expert = expertRepository.findById(bookingRequest.getExpertId()).orElseThrow(() -> new NotFoundException("Expert not found"));

            //check xem slot nay, staff nay, ngay nay da duoc booking hay chua
            SlotExpert checkExpert = slotExpertRepository.findBySlotIdAndExpertIdAndDate(bookingRequest.getSlotId(), bookingRequest.getExpertId(), bookingRequest.getBookingDate());
            if(checkExpert != null && SlotStatus.BOOKED.equals(checkExpert.getStatus())){
                throw new BookingException("Selected staff is not available for the chosen slot on the given data");
            }
        }else{
            //ng la book
            List<User> experts = expertRepository.findAllByRoleEnum(RoleEnum.EXPERT);
            for (User account: experts){
                //check xem slot nay, staff nay, ngay nay da duoc booking hay chua
                SlotExpert checkExpert = slotExpertRepository.findBySlotIdAndExpertIdAndDate(bookingRequest.getSlotId(), account.getId() , bookingRequest.getBookingDate());
                if(checkExpert == null || !SlotStatus.BOOKED.equals(checkExpert.getStatus())){
                    expert = account;
                    break;
                }
            }
            //neu khong co staff nao ranh thi bao loi
            if(expert == null){
                throw new BookingException("No available staff for the selected slot");
            }
        }
            List<ServicePackage> servicePackages = serviceRepository.findByIdIn(bookingRequest.getServiceIds());
        Booking booking = new Booking();
        SlotExpert slotExpert = new SlotExpert();

        //tao booking
        booking.setCreateAt(LocalDateTime.now());
        booking.setServices(servicePackages);
        booking.setStatus(BookingEnum.PENDING);
        booking.setUser(userUtils.getCurrentUser());
        booking.setSlotExpert(slotExpert);

        //tao slotexpert
        slotExpert.setSlot(slot);
        slotExpert.setExpert(expert);
        slotExpert.getBookings().add(booking);
        slotExpert.setDate(bookingRequest.getBookingDate());
        slotExpert.setStatus(SlotStatus.BOOKED);

        slotExpertRepository.save(slotExpert);

        return bookingRepository.save(booking);
    }

    public List<Booking> getBooking() {
    return bookingRepository.findAll();
    }

    public Booking updateStatus(BookingEnum status, long id) {
        Booking booking = bookingRepository.findBookingById(id);
        if (booking == null) {
            throw new NotFoundException("Booking not found");
        }

        // Condition: Payment calculation only when status changes to AWAIT
        if (status == BookingEnum.AWAIT && booking.getStatus() != BookingEnum.AWAIT) {
            calculateAndSaveExpertPayment(booking);
        }
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long id, BookingRequest bookingRequest) {
        User expert = null;
        Slot slot = slotRepository.findById(bookingRequest.getSlotId()).orElseThrow(() -> new NotFoundException("Slot not found"));
        //code here

        if (bookingRequest.getBookingDate().isBefore(LocalDate.now())) {
            throw new BookingException("Booking date cannot be in the past");
        }


        //ng quen booking nen chon luon staff
        if (bookingRequest.getExpertId() != null){
            expert = expertRepository.findById(bookingRequest.getExpertId()).orElseThrow(() -> new NotFoundException("Expert not found"));

            //check xem slot nay, staff nay, ngay nay da duoc booking hay chua
            SlotExpert checkExpert = slotExpertRepository.findBySlotIdAndExpertIdAndDate(bookingRequest.getSlotId(), bookingRequest.getExpertId(), bookingRequest.getBookingDate());
            if(checkExpert != null && SlotStatus.BOOKED.equals(checkExpert.getStatus())){
                throw new BookingException("Selected staff is not available for the chosen slot on the given data");
            }
        }else{
            //ng la book
            List<User> experts = expertRepository.findAllByRoleEnum(RoleEnum.EXPERT);
            for (User account: experts){
                //check xem slot nay, staff nay, ngay nay da duoc booking hay chua
                SlotExpert checkExpert = slotExpertRepository.findBySlotIdAndExpertIdAndDate(bookingRequest.getSlotId(), account.getId() , bookingRequest.getBookingDate());
                if(checkExpert == null || !SlotStatus.BOOKED.equals(checkExpert.getStatus())){
                    expert = account;
                    break;
                }
            }
            //neu khong co staff nao ranh thi bao loi
            if(expert == null){
                throw new BookingException("No available staff for the selected slot");
            }
        }
        Booking booking = bookingRepository.findBookingById(id);
        SlotExpert slotExpert = new SlotExpert();
        booking.setServices(serviceRepository.findByIdIn(bookingRequest.getServiceIds()));
        booking.setSlotExpert(slotExpert);

        slotExpert.setSlot(slot);
        slotExpert.setExpert(expert);
        slotExpert.getBookings().add(booking);
        slotExpert.setDate(bookingRequest.getBookingDate());
        slotExpert.setStatus(SlotStatus.BOOKED);

        slotExpertRepository.save(slotExpert);

        return bookingRepository.save(booking);
    }
}
