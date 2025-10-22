import { storage } from "./storage";

async function seed() {
  try {
    console.log("Seeding database...");

    // Create admin user
    const adminUser = await storage.createUser({
      username: "admin",
      password: "admin123",
      role: "admin",
    });
    console.log("Created admin user:", adminUser.username);

    // Create Chapter 1: Spring Destiny
    const chapter1 = await storage.createChapter({
      title: "Spring Destiny",
      description: "The beginning of our story under the cherry blossoms",
      order: 1,
    });

    // Create sections for Chapter 1
    const section1 = await storage.createSection({
      chapterId: chapter1.id,
      title: "Under the Cherry Blossoms",
      mood: "Romantic",
      tags: ["spring", "first-meeting", "destiny"],
      order: 1,
    });

    const section2 = await storage.createSection({
      chapterId: chapter1.id,
      title: "The Coffee Shop Promise",
      mood: "Hopeful",
      tags: ["cafe", "promise", "beginning"],
      order: 2,
    });

    // Create pages for section 1
    await storage.createPage({
      sectionId: section1.id,
      content: `Seoul in the spring is a different world. The cherry blossoms paint the city in soft pinks and whites, and everywhere you look, there's a promise of new beginnings.

I didn't expect to meet you that day. The forecast said rain, but I went out anyway, drawn by the last day of cherry blossom season at Yeouido Park.

The petals were falling like snow, and I was trying to capture the perfect photo when my camera slipped from my hands. Before it could hit the ground, you caught it.

"Careful," you said, smiling. "These moments are too precious to drop."

That's when I first saw your eyes – warm, kind, and somehow familiar, as if I'd known them in another lifetime.

They say there's a red thread connecting those who are destined to meet. In that moment, under the falling petals, I felt it pull tight between us.`,
      pageNumber: 1,
    });

    await storage.createPage({
      sectionId: section1.id,
      content: `"Thank you," I managed to say, my heart beating faster than it should from a simple act of kindness.

"I'm here doing the same thing," you said, showing me your own camera. "Trying to hold onto spring before it's gone."

We walked together that afternoon, comparing photos, talking about nothing and everything. You told me about your work as a photographer, how you chase light and moments. I told you about my writing, how I try to capture feelings in words.

When the rain finally came, we stood under a single umbrella, watching the last petals wash away down the street.

"I feel like I've been waiting to meet you," you said quietly.

"Me too," I whispered back, and I meant it with every fiber of my being.

That was the beginning. Our red thread had found its match.`,
      pageNumber: 2,
    });

    // Create pages for section 2
    await storage.createPage({
      sectionId: section2.id,
      content: `The café became our place. Every Sunday at 2 PM, without fail, we'd meet at the corner table by the window.

"Same order?" the barista would ask, already knowing the answer. Two americanos, one croissant to share.

You'd show me the photos from your week – street scenes, landscapes, faces that told stories. I'd read you passages from whatever I was working on, watching your reactions to gauge if the words landed right.

"You capture time," I told you once. "I capture feelings."

"Maybe together we capture life," you said, and that's when you made the promise.`,
      pageNumber: 1,
    });

    await storage.createPage({
      sectionId: section2.id,
      content: `"Let's make a promise," you said, pulling out your camera. "Every important moment, we document it. Your words, my photos. We'll create our own archive of this love."

Love. That was the first time either of us had said it out loud.

"Yes," I agreed, feeling the red thread between us pull tighter, more visible, more real.

You took a photo of us in the café window, the spring light filtering through, our reflections overlapping with the Seoul street behind us.

"The first entry in our archive," you said, and kissed my forehead.

I wrote three words in my notebook: "Spring. Destiny. Forever."

The promise was made. The thread was tied. And our story continued to unfold, one moment at a time.`,
      pageNumber: 2,
    });

    // Create Chapter 2: Summer Adventures
    const chapter2 = await storage.createChapter({
      title: "Summer Adventures",
      description: "Exploring the city together in the golden summer light",
      order: 2,
    });

    const section3 = await storage.createSection({
      chapterId: chapter2.id,
      title: "Han River Nights",
      mood: "Peaceful",
      tags: ["summer", "han-river", "memories"],
      order: 1,
    });

    await storage.createPage({
      sectionId: section3.id,
      content: `Summer in Seoul brought a different kind of magic. The humid air carried the sounds of cicadas and laughter from the Han River parks.

Every Friday night, we'd ride our bikes along the river path, watching the city lights reflect on the water. You'd bring your camera, always ready to capture the golden hour.

"Look," you'd say, pointing at the way the sunset painted the bridges. "This is why I love photography. How it freezes these fleeting moments."

We'd stop at the convenience store, buying cold drinks and kimbap, finding our spot on the grass. Other couples surrounded us, but in those moments, we had our own universe.

The red thread that connected us seemed to glow brighter in the summer twilight.`,
      pageNumber: 1,
    });

    console.log("Database seeded successfully!");
    console.log("\nLogin credentials:");
    console.log("Username: admin");
    console.log("Password: admin123");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed();
