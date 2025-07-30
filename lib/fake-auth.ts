// Fake authentication utility for testing Stripe flow
// In production, replace with real auth system

interface FakeUser {
  id: string;
  email: string;
}

// In-memory storage for demo (use real DB in production)
const fakeUsers = new Map<string, FakeUser>();
const fakeUserSessions = new Map<string, string>(); // sessionId -> userId

export function createFakeUser(email: string): FakeUser {
  const user: FakeUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
  };
  
  fakeUsers.set(user.id, user);
  return user;
}

export function getFakeUser(userId: string): FakeUser | null {
  return fakeUsers.get(userId) || null;
}

// For demo purposes, create a session that lasts for the request
export function createFakeSession(user: FakeUser): string {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  fakeUserSessions.set(sessionId, user.id);
  return sessionId;
}

export function getFakeUserFromSession(sessionId: string): FakeUser | null {
  const userId = fakeUserSessions.get(sessionId);
  if (!userId) return null;
  return getFakeUser(userId);
}

// Simulate getting current user from request
export function getFakeCurrentUser(): FakeUser {
  // For demo, always return a test user
  // In production, extract from cookies/headers/JWT
  const testEmail = "test@example.com";
  
  // Find existing test user or create new one
  const existingUser = Array.from(fakeUsers.values()).find(u => u.email === testEmail);
  if (existingUser) {
    return existingUser;
  }
  
  return createFakeUser(testEmail);
}