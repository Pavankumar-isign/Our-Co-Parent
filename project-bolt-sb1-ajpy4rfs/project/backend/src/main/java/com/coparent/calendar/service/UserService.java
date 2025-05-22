
package com.coparent.calendar.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coparent.calendar.dto.UserFamilyDTO;
import com.coparent.calendar.entity.Child;
import com.coparent.calendar.entity.CoParent;
import com.coparent.calendar.entity.User;
import com.coparent.calendar.entity.UserRole;
import com.coparent.calendar.repository.ChildRepository;
import com.coparent.calendar.repository.CoParentRepository;
import com.coparent.calendar.repository.UserRepository;
import com.coparent.calendar.utility.UserFamilyMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;
	private final CoParentRepository coParentRepository;
	private final ChildRepository childRepository;

//	@Transactional
//	public CoParent setCoParent(String userId, CoParent coParentData) {
//		User user = userRepository.findByEmail(userId).orElseThrow(() -> new RuntimeException("User not found"));
//
//		// Check if email is already registered
//		if (userRepository.existsByEmail(coParentData.getEmail())) {
//			throw new RuntimeException("Email already registered");
//		}
//
//		coParentData.setUser(user);
//		return coParentRepository.save(coParentData);
//	}

	@Transactional
	public CoParent setCoParent(String currentUserEmail, CoParent coParentData) {
		User currentUser = userRepository.findByEmail(currentUserEmail)
				.orElseThrow(() -> new RuntimeException("User not found"));

		if (userRepository.existsByEmail(coParentData.getEmail())) {
			throw new RuntimeException("Email already registered");
		}

		// 1. Create the co-parent user
		User coParentUser = User.builder().name(coParentData.getName()).email(coParentData.getEmail()).password("") // optional
				.role(UserRole.PARENT).phone(coParentData.getPhone()).color(generateUserColor()).build();
		coParentUser = userRepository.save(coParentUser);

		// 2. Save co-parent record (linked by currentUser)
		CoParent coParent = new CoParent();
		coParent.setName(coParentData.getName());
		coParent.setEmail(coParentData.getEmail());
		coParent.setPhone(coParentData.getPhone());
		coParent.setRelationship(coParentData.getRelationship());
		coParent.setUser(coParentUser);
		coParent.setLinkedBy(currentUser);
		coParent.setCreatedAt(LocalDateTime.now());
		coParent.setUpdatedAt(LocalDateTime.now());
		coParentRepository.save(coParent);

		// ✅ 3. Save main parent as co-parent too (reverse mapping)
		CoParent mainAsCoParent = new CoParent();
		mainAsCoParent.setName(currentUser.getName());
		mainAsCoParent.setEmail(currentUser.getEmail());
		mainAsCoParent.setPhone(currentUser.getPhone());
		mainAsCoParent.setRelationship("Parent");
		mainAsCoParent.setUser(currentUser);
		mainAsCoParent.setLinkedBy(coParentUser); // 👈 reverse link
		mainAsCoParent.setCreatedAt(LocalDateTime.now());
		mainAsCoParent.setUpdatedAt(LocalDateTime.now());
		coParentRepository.save(mainAsCoParent);

		return coParentRepository.save(coParent);
	}

	private static final List<String> COLOR_PALETTE = List.of("#FF5733", "#33C1FF", "#FF33A1", "#33FF57", "#FFC133",
			"#8E44AD", "#2ECC71", "#E67E22", "#3498DB", "#E74C3C");

	public String generateUserColor() {
		// Fetch all existing user colors from the DB
		List<String> usedColors = userRepository.findAll().stream().map(User::getColor).filter(Objects::nonNull)
				.toList();

		// Pick a color that isn't used yet
		for (String color : COLOR_PALETTE) {
			if (!usedColors.contains(color)) {
				return color;
			}
		}

		// Fallback: return a random color from the palette (or generate random hex)
		return getRandomColor();
	}

	private String getRandomColor() {
		Random random = new Random();
		int r = random.nextInt(256);
		int g = random.nextInt(256);
		int b = random.nextInt(256);
		return String.format("#%02X%02X%02X", r, g, b);
	}

	@Transactional
	public List<Child> addChildren(String userId, List<Child> children) {
		User user = userRepository.findByEmail(userId).orElseThrow(() -> new RuntimeException("User not found"));

		children.forEach(child -> child.setParent(user));
		return childRepository.saveAll(children);
	}

	@Transactional
	public Child updateChild(String userId, String childId, Child childData) {
		Child child = childRepository.findById(childId).orElseThrow(() -> new RuntimeException("Child not found"));

		if (!child.getParent().getId().equals(userId)) {
			throw new RuntimeException("Not authorized to update this child");
		}

		child.setName(childData.getName());
		child.setDateOfBirth(childData.getDateOfBirth());
		child.setGender(childData.getGender());
		child.setNotes(childData.getNotes());

		return childRepository.save(child);
	}

//	@Transactional(readOnly = true)
//	public UserFamilyDTO getUserFamily(String userId) {
//		User user = userRepository.findByEmail(userId).orElseThrow(() -> new RuntimeException("User not found"));
//		CoParent coParent = coParentRepository.findByLinkedById(user.getId());
//		List<Child> children = childRepository.findByParentId(user.getId());
//
//		return new UserFamilyDTO(UserFamilyMapper.toCoParentDTO(coParent), UserFamilyMapper.toChildDTOList(children));
//	}

	@Transactional(readOnly = true)
	public UserFamilyDTO getUserFamily(String userEmail) {
		User currentUser = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new RuntimeException("User not found"));

		CoParent coParent = coParentRepository.findByLinkedById(currentUser.getId()); // means current user is the
																						// parent
		List<Child> children;

		if (coParent != null && coParent.getRelationship().equalsIgnoreCase("Parent")) {
			// current user is the main parent
			children = childRepository.findByParentId(coParent.getUser().getId());
		} else {
			// current user is the co-parent
			CoParent meAsCoParent = coParentRepository.findByUserId(currentUser.getId());
			if (meAsCoParent == null) {
				throw new RuntimeException("This user is not a co-parent or parent");
			}

			User mainParent = meAsCoParent.getLinkedBy();
			children = childRepository.findByParentId(meAsCoParent.getUser().getId());

//			// Reassign coParent to the actual co-parent (i.e. the main user’s co-parent)
//			coParent = coParentRepository.findByUserId(mainParent.getId());
		}

		return new UserFamilyDTO(UserFamilyMapper.toCoParentDTO(coParent), UserFamilyMapper.toChildDTOList(children));
	}

//	@Transactional(readOnly = true)
//	public UserFamilyDTO getUserFamily(String userIdOrEmail) {
//		User currentUser = userRepository.findByEmail(userIdOrEmail)
//				.orElseThrow(() -> new RuntimeException("User not found"));
//
//		// Check if user was added as a co-parent (reverse lookup)
//		Optional<CoParent> originalParentLinkedMe = coParentRepository.findByEmail(currentUser.getEmail());
//
//		CoParent myCoParent = null;
//
//		if (originalParentLinkedMe.isPresent()) {
//			// Then get the parent who added me
//			myCoParent = coParentRepository.findByUserId(originalParentLinkedMe.get().getUser().getId());
//		} else {
//			// I'm the main parent, get my co-parent
//			myCoParent = coParentRepository.findByUserId(currentUser.getId());
//		}
//
//		List<Child> children = childRepository
//				.findByParentId(originalParentLinkedMe.isPresent() ? originalParentLinkedMe.get().getUser().getId()
//						: currentUser.getId());
//
//		return new UserFamilyDTO(UserFamilyMapper.toCoParentDTO(myCoParent), UserFamilyMapper.toChildDTOList(children));
//	}

}