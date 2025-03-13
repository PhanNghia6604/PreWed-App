package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.entity.request.BookingRequest;
import com.example.demo.enums.BookingEnum;
import com.example.demo.enums.RoleEnum;
import com.example.demo.enums.SlotStatus;
import com.example.demo.exception.exceptions.NotFoundException;
import com.example.demo.repository.*;
import com.example.demo.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Booking createBooking(BookingRequest bookingRequest) throws Exception {
        User expert = null;
        Slot slot = slotRepository.findById(bookingRequest.getSlotId()).orElseThrow(() -> new NotFoundException("Slot not found"));

        //ng quen booking nen chon luon staff
        if (bookingRequest.getExpertId() != null){
            expert = expertRepository.findById(bookingRequest.getExpertId()).orElseThrow(() -> new NotFoundException("Expert not found"));

            //check xem slot nay, staff nay, ngay nay da duoc booking hay chua
            SlotExpert checkExpert = slotExpertRepository.findBySlotIdAndExpertIdAndDate(bookingRequest.getSlotId(), bookingRequest.getExpertId(), bookingRequest.getBookingDate());
            if(checkExpert != null && SlotStatus.BOOKED.equals(checkExpert.getStatus())){
                throw new Exception("Selected staff is not available for the chosen slot on the given data");
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
                throw new Exception("No available staff for the selected slot");
            }
        }
            List<ServicePackage> servicePackages = serviceRepository.findByIdIn(bookingRequest.getServiceIds());
        Booking booking = new Booking();
        SlotExpert slotExpert = new SlotExpert();

        //tao booking
        booking.setCreateAt(LocalDateTime.now());
        booking.setServices(servicePackages);
        booking.setStatus(BookingEnum.PENDING);
      //  booking.setUser(userUtils.getCurrentUser());
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
}
